import { NextFunction, Request, Response } from 'express';
import { findChatById } from '@/services/chat/findChatById';
import { findMessagesByChatId } from '@/services/chat/findMessagesByChatId';

/**
 * @api {get} /chats/:chatId/messages Get all messages for the chat.
 * @apiName GetMessages
 * @apiGroup Chat
 *
 * @apiParam {Number} chatId Chat's unique ID.
 *
 * @apiSuccess (200) {Object[]} messages List of messages.
 * @apiSuccess (200) {Number} messages.id Message's unique ID.
 * @apiSuccess (200) {String} messages.role Message's role.
 * @apiSuccess (200) {String} messages.content Message's content.
 * @apiSuccess (200) {String} messages.createdAt Message's creation date.
 */
export async function handleGetMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chat = await findChatById(req.params.chatId);
  if (!chat || chat.accountId !== req.user!.id) {
    res.status(404);
    return next(new Error('Chat not found'));
  }

  const messages = await findMessagesByChatId(chat.id);
  res.json(
    messages.map((message) => ({
      id: message.uid,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  );
}
