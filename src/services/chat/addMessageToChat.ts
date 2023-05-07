import { prisma } from '../../lib/prisma';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Chat } from '@prisma/client';

export async function addMessageToChat(
  chat: Chat,
  messageContent: string,
  role: ChatCompletionRequestMessageRoleEnum,
) {
  return prisma.chat.update({
    where: {
      id: chat.id,
    },
    include: {
      messages: true,
    },
    data: {
      updatedAt: new Date(),
      messages: {
        create: [
          {
            content: messageContent,
            role,
            account: {
              connect: {
                id: chat.accountId,
              },
            },
          },
        ],
      },
    },
  });
}
