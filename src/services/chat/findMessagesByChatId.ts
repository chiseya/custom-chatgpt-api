import { prisma } from '../../lib/prisma';

export function findMessagesByChatId(chatId: string) {
  return prisma.message.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
