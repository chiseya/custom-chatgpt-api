import express from 'express';
import { requiresAuth } from '@/middlewares';
import chat from '@/routes/chat';
import verify from '@/routes/verify';

const router = express.Router();
router.use('/chat', requiresAuth, chat);
router.use('/verify', requiresAuth, verify);

export default router;
