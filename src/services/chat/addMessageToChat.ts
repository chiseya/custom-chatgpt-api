import { prisma } from '../../lib/prisma';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { Chat } from '@prisma/client';

/**
 * Add messages to a chat and return all messages including the new ones
 * @param chat
 * @param messages
 */
export async function addMessagesToChat(
  chat: Chat,
  messages: {
    messageContent: string;
    role: ChatCompletionRequestMessageRoleEnum;
  }[],
) {
  return prisma.$transaction(async (prisma) => {
    await prisma.message.createMany({
      data: messages.map(({ messageContent, role }) => ({
        content: messageContent,
        role,
        accountId: chat.accountId,
        chatId: chat.id,
      })),
    });
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
    return prisma.message.findMany({
      where: {
        chatId: chat.id,
      },
      orderBy: {
        id: 'asc',
      },
    });
  });
}
