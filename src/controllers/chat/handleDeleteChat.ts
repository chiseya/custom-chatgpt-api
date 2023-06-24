import { NextFunction, Request, Response } from 'express';
import { findChatById } from '@/services/chat/findChatById';
import { deleteChatById } from '@/services/chat/deleteChat';

/**
 * @api {delete} /chats/:chatId Delete chat
 * @apiName DeleteChat
 * @apiGroup Chat
 *
 * @apiParam {String} chatId Chat's unique ID.
 *
 * @apiSuccess (204) {null} null No content.
 */
export async function handleDeleteChat(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chat = await findChatById(req.params.chatId);
  if (!chat || chat.accountId !== req.user!.id) {
    res.status(404);
    return next(new Error('Chat not found'));
  }
  await deleteChatById(chat.id);
  res.sendStatus(204);
}
