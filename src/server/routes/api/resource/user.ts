import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { Router } from 'express';
import { APIResourceProfileRouteReturn, decryptedAccessToken } from 'tajimise';
import { discordGetIdentity } from '../../../utils/oauthWorkflow.js';
import TajiMiseClient from '../../../../res/TajiMiseClient.js';

const router = Router();

/**
 * sends back username and profile picture
 */
router.get('/profile', async (req, res) => {
    /**
     * object to be return
     */
    const returnData: APIResourceProfileRouteReturn = { name: '', avatarURL: null };

    /**
     * asking for additional data (include email & strategy in return);
     */
    const { additional } = req.query;

    switch (req.signedCookies['strategy']) {
        case 'discord':
            const userDiscordIdentity = await discordGetIdentity(req.accessToken.access_token);
            if (!userDiscordIdentity) return res.sendStatus(401);

            /**
             * username: string
             */
            returnData.name = userDiscordIdentity.username;

            /**
             * avatarURL: string | null
             */
            if (userDiscordIdentity.avatar)
                returnData.avatarURL = `https://cdn.discordapp.com/avatars/${userDiscordIdentity.id}/${userDiscordIdentity.avatar}?size=4096`;

            /**
             * additional data
             */
            if (additional === 'true') {
                returnData.email = userDiscordIdentity.email;
                returnData.strategy = req.signedCookies['strategy'];
            }
            break;

        default:
            return res.sendStatus(401);
    }

    res.json(returnData);
});

/**
 * check if user is admin by user id
 */
router.get('/is-admin', async (req, res) => {
    const { strategy } = req.signedCookies;
    const { uid } = req.accessToken;

    const adminDocument = await TajiMiseClient.database
        .collection('admin')
        .where('user_id', '==', { [strategy]: uid })
        .get();

    if (adminDocument.empty) return res.send('false');
    res.send('true');
});

export default router;
