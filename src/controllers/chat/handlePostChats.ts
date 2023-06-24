import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { createChat } from '@/services/chat/createChat';

const requestSchema = z.object({
  title: z.string().optional(),
});

/**
 * @api {post} /chats Create a new chat.
 * @apiName PostChats
 * @apiGroup Chat
 *
 * @apiParam {String} [title] Chat's title.
 *
 * @apiSuccess (200) {String} chatId Chat's unique ID.
 */
export async function handlePostChats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = requestSchema.safeParse(req.body);
  if (!request.success) {
    res.status(400);
    return next(new Error('Invalid request body'));
  }

  const chat = await createChat(req.user!.id, request.data.title);
  res.json({
    chatId: chat.id,
  });
}
