import { Request, Response } from 'express';
import { createNewChat } from '../../services/chat/createNewChat';
import { z } from 'zod';

const requestSchema = z.object({
  title: z.string().optional(),
});

export async function createChat(req: Request, res: Response) {
  const request = requestSchema.safeParse(req.body);
  if (!request.success) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const chat = await createNewChat(req.user!.id, request.data.title);
  return res.json({
    chatId: chat.id,
  });
}
