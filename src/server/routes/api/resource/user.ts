import { Router } from 'express';
import { discordGetIdentity } from '../../../utils/oauthWorkflow.js';

const router = Router();

/**
 * sends back username and profile picture
 */
router.get('/profile', async (req, res) => {
    switch (req.signedCookies['strategy']) {
        case 'discord':
            const userDiscordIdentity = await discordGetIdentity(req.accessToken);

            if (!userDiscordIdentity) return res.sendStatus(401);
            return res.send({
                name: userDiscordIdentity.username,
                profilePicture: userDiscordIdentity.avatar,
            });

        default:
            return res.redirect('/api/auth/reset-session');
    }
});

export default router;
