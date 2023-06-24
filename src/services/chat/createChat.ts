import { Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Creates a new chat associated with the provided account ID.
 * @param accountId - The ID of the account that will be associated with the chat.
 * @param [title] - The title of the chat. If not provided, it defaults to 'Untitled'.
 * @returns The chat that was created.
 */
export async function createChat(accountId: Account['id'], title?: string) {
  return prisma.chat.create({
    data: {
      name: title || 'Untitled',
      account: {
        connect: {
          id: accountId,
        },
      },
    },
  });
}
