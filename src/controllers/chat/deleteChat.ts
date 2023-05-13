import { NextFunction, Request, Response } from 'express';
import { findChatById } from '../../services/chat/findChatById';
import { deleteChatById } from '../../services/chat/deleteChat';

export async function deleteChat(
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
