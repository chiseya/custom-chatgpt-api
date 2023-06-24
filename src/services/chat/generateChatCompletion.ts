import axios from 'axios';
import { ChatCompletionRequestMessage } from 'openai';
import { Chat } from '@prisma/client';
import { openai } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

/**
 * Asynchronously generates chat completion using the GPT-4 model for a given chat ID.
 * @param chatId - The ID of the chat for which the completion is to be generated.
 * @yields {string} - The tokens generated for the chat completion.
 * @throws {Error} - If an error occurs during the OpenAI API call, the error message is parsed and thrown.
 */
export async function* generateChatCompletion(chatId: Chat['id']) {
  const messages = await prisma.message.findMany({
    select: {
      role: true,
      content: true,
    },
    where: {
      chatId,
    },
    orderBy: {
      id: 'asc',
    },
  });

  try {
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-4',
        messages: messages as ChatCompletionRequestMessage[],
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
