import { Request, Response } from 'express';
import { findChatsByAccountId } from '@/services/chat/findChatsByAccountId';

/**
 * @api {get} /chats Get all chats for the authenticated user.
 * @apiName GetChats
 * @apiGroup Chat
 *
 * @apiSuccess (200) {Object[]} chats List of chats.
 * @apiSuccess (200) {String} chats.id Chat's unique ID.
 * @apiSuccess (200) {String} chats.title Chat's title.
 * @apiSuccess (200) {String} chats.createdAt Chat's creation date.
 * @apiSuccess (200) {String} chats.updatedAt Chat's last update date.
 */
export async function handleGetChats(req: Request, res: Response) {
  const chats = await findChatsByAccountId(req.user!.id);
  res.json(
    chats.map((chat) => ({
      id: chat.id,
      title: chat.name,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    })),
  );
}
