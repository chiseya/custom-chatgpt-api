import express from 'express';
import chat from './chat';
import { requiresAuth } from '../middlewares';
import { ok } from '../controllers/misc/ok';

const router = express.Router();
router.use('/chat', requiresAuth, chat);
router.get('/verify', requiresAuth, ok);

export default router;
