import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { streamChatCompletion } from '../../services/chat/streamChatCompletion';
import { addMessagesToChat } from '../../services/chat/addMessageToChat';
import { findChatById } from '../../services/chat/findChatById';
import { updateMessage } from '../../services/chat/updateMessage';
import { prepareAssistantMessage } from '../../services/chat/prepareAsistantMessage';

const requestSchema = z.object({
  messageContent: z.string(),
  systemPrompt: z.string().optional(),
});

export async function generateChatCompletion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = requestSchema.safeParse(req.body);
  if (!request.success) {
    res.status(400);
    return next(new Error('Invalid request body'));
  }

  const targetChat = await findChatById(req.params.chatId, true);
  if (!targetChat || targetChat.accountId !== req.user!.id) {
    res.status(404);
    return next(new Error('Chat not found'));
  }

  const messages = await addMessagesToChat(targetChat, [
    ...(request.data.systemPrompt && targetChat.messages.length === 0
      ? [
          {
            messageContent: request.data.systemPrompt,
            role: ChatCompletionRequestMessageRoleEnum.System,
          },
        ]
      : []),
    {
      messageContent: request.data.messageContent,
      role: ChatCompletionRequestMessageRoleEnum.User,
    },
  ]);

  try {
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    let responseMessageContent = '';
    const responseMessage = await prepareAssistantMessage(targetChat);
    for await (const data of streamChatCompletion(messages)) {
      res.write(data);
      responseMessageContent += data;
    }
    await updateMessage(responseMessage.id, responseMessageContent);

    res.end();
  } catch (e) {
    res.status(500);
    next(new Error('Internal Server Error'));
  }
}
