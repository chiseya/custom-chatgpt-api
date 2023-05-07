import { Request, Response } from 'express';
import { findChatById } from '../../services/chat/findChatById';
import { deleteChatById } from '../../services/chat/deleteChat';

export async function deleteChat(req: Request, res: Response) {
  const chat = await findChatById(req.params.chatId);
  if (!chat || chat.accountId !== req.user!.id) {
    return res.status(404).send({ message: 'Chat not found' });
  }
  await deleteChatById(chat.id);
  res.sendStatus(204);
}
