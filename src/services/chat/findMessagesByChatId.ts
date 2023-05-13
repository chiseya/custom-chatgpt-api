import { prisma } from '../../lib/prisma';
import { Chat } from '@prisma/client';

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
