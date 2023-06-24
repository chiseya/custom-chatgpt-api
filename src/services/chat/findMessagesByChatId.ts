import { Chat } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Retrieves all messages associated with a specific chat ID.
 * @param chatId - The ID of the chat to find associated messages.
 * @returns The messages in descending order of their IDs.
 */
export function findMessagesByChatId(chatId: Chat['id']) {
  return prisma.message.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      id: 'desc',
    },
  });
}
