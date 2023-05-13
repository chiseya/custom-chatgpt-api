import { prisma } from '../../lib/prisma';
import { Chat } from '@prisma/client';

export async function findChatById(chatId: Chat['id'], withMessages = false) {
  return prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: withMessages,
    },
  });
}
