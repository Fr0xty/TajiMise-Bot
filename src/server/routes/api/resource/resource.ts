/**
 * resource endpoint (protected route)
 */
import { Router } from 'express';
import JWT from 'jsonwebtoken';
import userRouter from './user.js';

const router = Router();

/**
 * access token check
 */
router.use(async (req, res) => {
    if (!req.signedCookies['at']) return res.sendStatus(401);

    try {
        req.accessToken = JWT.verify(req.signedCookies['at'], process.env.JWT_SECRET_KEY!).toString();
    } catch {
        /**
         * tampered access token: reset session
         */
        res.redirect('/api/auth/reset-session');
    }
});

router.use(userRouter);

export default router;
