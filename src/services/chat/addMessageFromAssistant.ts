import { Chat } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

/**
 * Adds an assistant's message to a chat.
 * @param chat - The chat object with 'id' and 'accountId' properties.
 * @param assistantMessage - The assistant's message.
 * @returns The message that was added.
 */
export function addMessageFromAssistant(
  chat: Pick<Chat, 'id' | 'accountId'>,
  assistantMessage: string,
) {
  return prisma.message.create({
    data: {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: assistantMessage,
      account: {
        connect: {
          id: chat.accountId,
        },
      },
      chat: {
        connect: {
          id: chat.id,
        },
      },
    },
  });
}
