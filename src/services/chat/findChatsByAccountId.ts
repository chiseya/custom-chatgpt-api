import { Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Retrieves all chats associated with a specific account ID.
 * @param accountId - The ID of the account to find associated chats.
 * @returns The chats in descending order of their creation date.
 */
export function findChatsByAccountId(accountId: Account['id']) {
  return prisma.chat.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
