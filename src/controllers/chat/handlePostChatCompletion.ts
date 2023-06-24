import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { generateChatCompletion } from '@/services/chat/generateChatCompletion';
import { addMessageFromUser } from '@/services/chat/addMessageFromUser';
import { findChatById } from '@/services/chat/findChatById';
import { addMessageFromAssistant } from '@/services/chat/addMessageFromAssistant';

const requestSchema = z.object({
  messageContent: z.string(),
  systemPrompt: z.string().optional(),
});

/**
 * @api {post} /chats/:chatId/completion Get chat completion.
 * @apiName PostChatCompletion
 * @apiGroup Chat
 *
 * @apiParam {Number} chatId Chat's unique ID.
 * @apiParam {String} messageContent User's message content.
 * @apiParam {String} [systemPrompt] System's prompt.
 */
export async function handlePostChatCompletion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = requestSchema.safeParse(req.body);
  if (!request.success) {
    res.status(400);
    return next(new Error('Invalid request body'));
  }

  const targetChat = await findChatById(req.params.chatId);
  if (!targetChat || targetChat.accountId !== req.user!.id) {
    res.status(404);
    return next(new Error('Chat not found'));
  }

  const { messageContent: userMessage, systemPrompt } = request.data;
  await addMessageFromUser(targetChat, userMessage, systemPrompt);

  try {
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    let responseMessageContent = '';
    for await (const data of generateChatCompletion(targetChat.id)) {
      res.write(data);
      responseMessageContent += data;
    }
    await addMessageFromAssistant(targetChat, responseMessageContent);

    res.end();
  } catch (e) {
    res.status(500);
    next(new Error('Internal Server Error'));
  }
}
