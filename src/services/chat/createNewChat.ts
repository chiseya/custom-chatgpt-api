import { prisma } from '../../lib/prisma';
import { Account } from '@prisma/client';

export async function createNewChat(accountId: Account['id'], title?: string) {
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
