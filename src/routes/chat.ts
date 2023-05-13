import express from 'express';
import { generateChatCompletion } from '../controllers/chat/generateChatCompletion';
import { getMessages } from '../controllers/chat/getMessages';
import { getChats } from '../controllers/chat/getChats';
import { createChat } from '../controllers/chat/createChat';
import { deleteChat } from '../controllers/chat/deleteChat';

const router = express.Router();
router.get('/', getChats);
router.post('/', createChat);
router.delete('/:chatId', deleteChat);
router.post('/:chatId/completion', generateChatCompletion);
router.get('/:chatId/messages', getMessages);

export default router;
