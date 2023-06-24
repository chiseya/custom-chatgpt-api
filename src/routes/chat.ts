import express from 'express';
import { handlePostChatCompletion } from '@/controllers/chat/handlePostChatCompletion';
import { handleGetMessages } from '@/controllers/chat/handleGetMessages';
import { handleGetChats } from '@/controllers/chat/handleGetChats';
import { handlePostChats } from '@/controllers/chat/handlePostChats';
import { handleDeleteChat } from '@/controllers/chat/handleDeleteChat';

const router = express.Router();
router.get('/', handleGetChats);
router.post('/', handlePostChats);
router.delete('/:chatId', handleDeleteChat);
router.post('/:chatId/completion', handlePostChatCompletion);
router.get('/:chatId/messages', handleGetMessages);

export default router;
