import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { Router } from 'express';
import { discordGetIdentity, discordRefreshToken } from '../../../utils/oauthWorkflow.js';
import { clearOauthCookies } from '../../../utils/UserOauthLocalHelper.js';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../../utils/setCookies.js';

const router = Router();

/**
 * get a fresh access token
 */
router.post('/refresh-token', async (req, res) => {
    res.clearCookie('at', { path: '/' });
    res.clearCookie('rt', { path: '/' });
    const { strategy, rt: encryptedRefreshToken } = req.signedCookies;

    try {
        const decryptedRefreshToken = JWT.verify(encryptedRefreshToken, process.env.JWT_SECRET_KEY!);

        switch (strategy) {
            case 'discord':
                const newCreds = await discordRefreshToken(decryptedRefreshToken.toString());
                /**
                 * invalid refresh token
                 */
                if (!newCreds) return res.sendStatus(400);

                /**
                 * refresh successful: set new access_token and refresh_token
                 */
                const userDiscordIdentity = await discordGetIdentity(newCreds.access_token);
                await setRefreshTokenCookie(res, newCreds.refresh_token);
                await setAccessTokenCookie(res, {
                    uid: userDiscordIdentity!.id,
                    access_token: newCreds.access_token,
                });
                return res.sendStatus(200);

            default:
                /**
                 * unknown strategy
                 */
                return res.sendStatus(400);
        }
    } catch (err) {
        /**
         * cookie tampered (compromised)
         */
        console.log(err);
        res.sendStatus(400);
    }
});

/**
 * reset user session: remove cookies and redirect to home
 */
router.post('/reset-session', async (req, res) => {
    await clearOauthCookies(res);
    res.redirect('/');
});

export default router;
