import { Router } from 'express';
import { discordExchangeCodeForToken } from '../../../utils/oauthWorkflow.js';
import { createDiscordUserOauth } from '../../../utils/setupUserOauthLocal.js';

const router = Router();

/**
 * redirected to here after user third party oauth success
 */
router.get('/:strategy/redirect', async (req, res) => {
    const { strategy } = req.params;
    const { code } = req.query;
    if (!code) return res.sendStatus(400);

    switch (strategy) {
        case 'discord':
            /**
             * exchange code for oauth tokens
             */
            const creds = await discordExchangeCodeForToken(code.toString());
            /**
             * invalid code query: malicious request
             */
            if (!creds) return res.sendStatus(400);
            /**
             * setup user oauth and register to database
             */
            await createDiscordUserOauth(req, res, creds);
            return res.redirect('/');

        default:
            return res.sendStatus(400);
    }
});

export default router;
