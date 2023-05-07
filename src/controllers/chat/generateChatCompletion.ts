import { streamChatCompletion } from '../../services/chat/streamChatCompletion';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { addMessageToChat } from '../../services/chat/addMessageToChat';
import { findChatById } from '../../services/chat/findChatById';

const requestSchema = z.object({
  chatId: z.string(),
  messageContent: z.string(),
});

export async function generateChatCompletion(req: Request, res: Response) {
  const request = requestSchema.safeParse(req.body);
  if (!request.success) {
    return res.status(400).send({ message: 'Invalid request body' });
  }

  const targetChat = await findChatById(request.data.chatId);
  if (!targetChat || targetChat.accountId !== req.user!.id) {
    return res.status(404).send({ message: 'Chat not found' });
  }
  const chat = await addMessageToChat(
    targetChat,
    request.data.messageContent,
    ChatCompletionRequestMessageRoleEnum.User,
  );

  const messages = chat.messages.map((message) => ({
    role: message.role as ChatCompletionRequestMessageRoleEnum,
    content: message.content,
  }));

  console.log(messages);

  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    let response = '';
    for await (const data of streamChatCompletion(messages)) {
      res.write(data);
      response += data;
    }
    await addMessageToChat(
      chat,
      response,
      ChatCompletionRequestMessageRoleEnum.Assistant,
    );
  } catch (e) {
    return res.status(500).send({
      message: e instanceof Error ? e.message : 'Internal server error',
    });
  }
  res.end();
}
