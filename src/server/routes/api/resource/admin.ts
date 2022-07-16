import { Router } from 'express';
import TajiMiseClient from '../../../../res/TajiMiseClient.js';
import { accessTokenCheck } from '../../../utils/accessTokenCheck.js';

const router = Router();

/**
 * check if user is admin by user id
 */
router.get('/is-admin', accessTokenCheck, async (req, res) => {
    const { strategy } = req.signedCookies;
    const { uid } = req.accessToken;

    const adminDocument = await TajiMiseClient.database
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
export default router;
