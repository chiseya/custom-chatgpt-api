import { prisma } from '../../lib/prisma';

export function findChatsByAccountId(accountId: string) {
  return prisma.chat.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
