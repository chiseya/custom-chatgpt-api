import { Request, Response } from 'express';
import { findChatById } from '../../services/chat/findChatById';
import { findMessagesByChatId } from '../../services/chat/findMessagesByChatId';

export async function getMessages(req: Request, res: Response) {
  const chat = await findChatById(req.params.chatId);
  if (!chat || chat.accountId !== req.user!.id) {
    return res.status(404).send({ message: 'Chat not found' });
  }

  const messages = await findMessagesByChatId(chat.id);
  return res.json(
    messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  );
}
