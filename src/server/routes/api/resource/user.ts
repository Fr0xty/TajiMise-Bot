import { Router } from 'express';
import { APIResourceProfileRouteReturn } from 'tajimise';
import { discordGetIdentity } from '../../../utils/oauthWorkflow.js';

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
            const userDiscordIdentity = await discordGetIdentity(req.accessToken);
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
            return res.redirect('/api/auth/reset-session');
    }

    res.json(returnData);
});

export default router;
