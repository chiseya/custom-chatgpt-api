import { Chat } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Retrieves a chat by its ID.
 * @param chatId - The ID of the chat to retrieve.
 * @returns The chat that was found or null if no chat was found
 */
export async function findChatById(chatId: Chat['id']) {
  return prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });
}
