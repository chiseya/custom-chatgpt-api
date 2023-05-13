import { Chat } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export function prepareAssistantMessage(chat: Chat) {
  return prisma.message.create({
    data: {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: '',
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
