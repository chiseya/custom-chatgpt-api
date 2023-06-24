import { Chat } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Deletes a chat by its ID.
 * @param chatId - The ID of the chat to delete.
 * @returns The chat that was deleted.
 */
export async function deleteChatById(chatId: Chat['id']) {
  return prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
}
