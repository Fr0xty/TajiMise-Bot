import { Router } from 'express';
import Joi from 'joi';
import TajiMiseClient from '../../../../bot/res/TajiMiseClient.js';
import { isAdmin } from '../../../../bot/utils/identity.js';
import { accessTokenCheck } from '../../../utils/accessTokenCheck.js';

const router = Router();

/**
 * check if user is admin by user id
 */
router.get('/is-admin', accessTokenCheck, async (req, res) => {
    const { strategy } = req.signedCookies;
    const { uid } = req.accessToken;

    /**
     * if handle provided: admin handle must match
     * else: any admin
     */
    const { handle } = req.query;
    const adminDocument = handle
        ? await TajiMiseClient.database
              .collection('admin')
              .where('user_id', '==', { [strategy]: uid })
              .where('profile.handle', '==', handle)
              .get()
        : await TajiMiseClient.database
              .collection('admin')
              .where('user_id', '==', { [strategy]: uid })
              .get();

    if (adminDocument.empty) return res.send('false');
    res.send('true');
});

/**
 * get admin profile info
 */
router.get('/admin-info', async (req, res) => {
    const { handle } = req.query;

    /**
     * if no handle is provided, assume is getting all admin info
     */
    if (!handle) {
        const adminDataQuery = await TajiMiseClient.database.collection('admin').orderBy('order').get();
        const adminData: any[] = [];
        adminDataQuery.forEach((admin: any) => adminData.push(admin.data().profile));
        return res.send(adminData);
    }

    /**
     * find admin with given handle
     */
    const adminData = await TajiMiseClient.database.collection('admin').doc(handle).get();
    if (!adminData.exists) return res.sendStatus(404);

    res.send(adminData.data().profile);
});

/**
 * update admin profile info
 */
router.post('/update-admin-info', accessTokenCheck, async (req, res) => {
    const data = req.body;

    const dataSchema = Joi.object({
        adminHandle: Joi.string().required(),
        info: Joi.object({
            name: Joi.string().min(1).max(50).required(),
            bio: Joi.string().min(1).max(250).required(),
            pronouns: Joi.string().min(1).max(35).required(),
        }),
    });

    try {
        /**
         * check valid data object
         */
        await dataSchema.validateAsync(data);

        /**
         * check if is the profile owner
         */
        const authorized = await isAdmin(req, data.adminHandle);
        if (!authorized) return res.sendStatus(403);

        /**
         * update new info to database
         */
        const adminDocument = TajiMiseClient.database.collection('admin').doc(data.adminHandle);
        const adminDocumentData = (await adminDocument.get()).data();

        adminDocumentData.profile.name = data.info.name;
        adminDocumentData.profile.bio = data.info.bio;
        adminDocumentData.profile.pronouns = data.info.pronouns;

        adminDocument.update(adminDocumentData);
        res.sendStatus(200);
    } catch (err: any) {
        res.status(400).send(err.details[0].message);
    }
});

export default router;
