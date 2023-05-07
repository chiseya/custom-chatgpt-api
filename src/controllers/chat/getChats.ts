import { Request, Response } from 'express';
import { findChatsByAccountId } from '../../services/chat/findChatsByAccountId';

export async function getChats(req: Request, res: Response) {
  const chats = await findChatsByAccountId(req.user!.id);
  return res.json(
    chats.map((chat) => ({
      id: chat.id,
      title: chat.name,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    })),
  );
}
