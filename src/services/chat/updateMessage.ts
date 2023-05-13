import { Message } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export async function updateMessage(messageId: Message['id'], content: string) {
  return prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      content,
    },
  });
}
