/**
 * auth endpoint (public route)
 */
import { Router } from 'express';
import localRouter from './local.js';
import thirdpartyRouter from './thirdparty.js';

const router = Router();

router.use(localRouter);
router.use(thirdpartyRouter);

export default router;
