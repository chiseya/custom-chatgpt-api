import { prisma } from '../../lib/prisma';

export async function deleteChatById(chatId: string) {
  return prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
}
