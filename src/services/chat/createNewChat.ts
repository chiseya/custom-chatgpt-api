import { prisma } from '../../lib/prisma';

export async function createNewChat(accountId: string, title?: string) {
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
