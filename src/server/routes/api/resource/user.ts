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

            const userPfp = userDiscordIdentity.avatar
                ? `https://cdn.discordapp.com/avatars/${userDiscordIdentity.id}/${userDiscordIdentity.avatar}?size=4096`
                : null;

            return res.json({
                name: userDiscordIdentity.username,
                profilePicture: userPfp,
            });

        default:
            return res.redirect('/api/auth/reset-session');
    }
});

export default router;
