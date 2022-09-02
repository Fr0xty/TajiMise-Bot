/**
 * resource endpoint
 */
import { Router } from 'express';

import adminRouter from './admin.js';
import productRouter from './product.js';
import userRouter from './user.js';

const router = Router();

router.use(adminRouter);
router.use(productRouter);
router.use(userRouter);

export default router;
