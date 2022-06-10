/**
 * resource endpoint (protected route)
 */
import { Router } from 'express';
import userRouter from './user.js';

const router = Router();

/**
 * access token check
 */
router.use(async (req, res) => {
    if (!req.signedCookies['at']) return res.sendStatus(401);

    /**
     * token validation will depend on the third party provider
     */
});

router.use(userRouter);

export default router;
