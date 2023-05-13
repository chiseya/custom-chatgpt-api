import { prisma } from '../../lib/prisma';
import { Chat } from '@prisma/client';

export async function deleteChatById(chatId: Chat['id']) {
  return prisma.chat.delete({
    where: {
      id: chatId,
    },
  });
}
