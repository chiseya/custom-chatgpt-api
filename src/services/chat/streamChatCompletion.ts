import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import axios from 'axios';
import { openai } from '../../lib/openai';
import { Message } from '@prisma/client';

export async function* streamChatCompletion(messages: Message[]) {
  const openaiMessages = messages.map((message) => ({
    role: message.role as ChatCompletionRequestMessageRoleEnum,
    content: message.content,
  }));

  console.log(openaiMessages);

  try {
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-4',
        messages: openaiMessages,
        stream: true,
      },
      {
        // https://github.com/openai/openai-node/issues/18
        responseType: 'stream',
      },
    );
    yield* parseChatCompletionData(
      completion.data as unknown as AsyncIterable<Buffer>,
    );
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data) {
      const tmp = [];
      for await (const chunk of e.response?.data) {
        tmp.push(...chunk.toString('utf8').split('\n'));
      }
      const error = JSON.parse(tmp.join(''));
      throw new Error(error.error.message);
    } else {
      throw new Error('Internal Server Error');
    }
  }
}

async function* parseChatCompletionData(data: AsyncIterable<Buffer>) {
  for await (const chunk of data) {
    const lines: string[] = chunk
      .toString('utf8')
      .split('\n')
      .filter((line: string) => line.trim().startsWith('data: '));

    for (const line of lines) {
      const message = line.replace(/^data: /, '');
      if (message === '[DONE]') return;
      try {
        const json = JSON.parse(message);
        const token = json.choices[0].delta.content as string;
        if (token) {
          yield token;
        }
      } catch {
        // continue
      }
    }
  }
}
