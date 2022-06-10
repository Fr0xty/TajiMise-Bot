import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { Router } from 'express';
import { discordGetIdentity, discordRefreshToken } from '../../../utils/oauthWorkflow.js';
import { clearOauthCookies } from '../../../utils/UserOauthLocalHelper.js';

const router = Router();

/**
 * get a fresh access token
 */
router.post('/refresh-token', async (req, res) => {
    res.clearCookie('at', { path: '/', domain: process.env.FULL_DOMAIN });
    const { strategy, rt: encryptedRefreshToken } = req.signedCookies;
    console.log(encryptedRefreshToken);

    try {
        const decryptedRefreshToken = JWT.verify(encryptedRefreshToken, process.env.JWT_SECRET_KEY!);

        switch (strategy) {
            case 'discord':
                const newCreds = await discordRefreshToken(decryptedRefreshToken.toString());
                /**
                 * invalid refresh token
                 */
                if (!newCreds) {
                    await clearOauthCookies(res);
                    return res.sendStatus(400);
                }

                /**
                 * refresh successful: set new access_token
                 */
                const userDiscordIdentity = await discordGetIdentity(newCreds.access_token);
                res.cookie(
                    'at',
                    JWT.sign(
                        {
                            uid: userDiscordIdentity!.id,
                            access_token: newCreds.access_token,
                        },
                        process.env.JWT_SECRET_KEY!
                    ),
                    {
                        httpOnly: true,
                        signed: true,
                        sameSite: true,
                        // secure: true, // production setting: true
                    }
                );

            default:
                /**
                 * unknown strategy: reset session
                 */
                await clearOauthCookies(res);
                return res.sendStatus(400);
        }
    } catch (err) {
        /**
         * cookie tampered (compromised)
         */
        console.log(err);

        await clearOauthCookies(res);
        res.sendStatus(400);
    }
});

export default router;
