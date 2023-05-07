import { prisma } from '../../lib/prisma';

export async function findChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: {
      id: chatId,
    },
  });
}
