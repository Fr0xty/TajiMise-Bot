/**
 * top hierarchy of api routes
 */
import { Router } from 'express';
import authRouter from './auth/auth.js';
import resourceRouter from './resource/resource.js';
import redirectRouter from './redirect.js';
import localeRouter from './locale.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/resource', resourceRouter);
router.use('/redirect', redirectRouter);
router.use('/locale', localeRouter);

export default router;
