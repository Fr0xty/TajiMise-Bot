import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();

/**
 * get a fresh access token
 */
router.get('/refresh-token', async (req, res) => {
    res.clearCookie('at', { path: '/', domain: process.env.FULL_DOMAIN });
    const { strategy, encryptedRefreshToken } = req.signedCookies;
    try {
        const decryptedRefreshToken = JWT.verify(encryptedRefreshToken, process.env.JWT_SECRET_KEY!);
    } catch {
        /**
         * tampered (compromised)
         */
    }
    // TODO
    switch (strategy) {
        case 'discord':
    }
    res.send(req.signedCookies);
});

export default router;
