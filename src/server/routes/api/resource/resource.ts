/**
 * resource endpoint
 */
import { Router } from 'express';

import adminRouter from './admin.js';
import userRouter from './user.js';

const router = Router();

router.use(adminRouter);
router.use(userRouter);

export default router;
