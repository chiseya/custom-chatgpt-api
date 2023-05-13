import { prisma } from '../../lib/prisma';
import { Account } from '@prisma/client';

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
