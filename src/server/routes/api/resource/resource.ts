/**
 * resource endpoint (protected route)
 */
import { Router } from 'express';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { decryptedAccessToken } from 'tajimise';
import userRouter from './user.js';

const router = Router();

/**
 * access token check
 */
router.use(async (req, res, next) => {
    if (!req.signedCookies['at'] || !req.signedCookies['strategy']) return res.sendStatus(401);
    try {
        req.accessToken = JWT.verify(req.signedCookies['at'], process.env.JWT_SECRET_KEY!) as decryptedAccessToken;
        return next();
    } catch {
        /**
         * tampered access token: reset session
         */
        res.sendStatus(401);
    }
});

router.use(userRouter);

export default router;
