import { Chat } from '@prisma/client';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { prisma } from '@/lib/prisma';

type AddMessageToChatData = {
  messageContent: string;
  role: ChatCompletionRequestMessageRoleEnum;
};

/**
 * Adds a user's message to a chat, and optionally a system prompt at the beginning of the chat if it's the first message.
 * @param chat - The chat object with 'id' and 'accountId' properties.
 * @param userMessage - The user's message.
 * @param [systemPrompt] - The system prompt.
 * @returns The message that was added.
 */
export async function addMessageFromUser(
  chat: Pick<Chat, 'id' | 'accountId'>,
  userMessage: string,
  systemPrompt?: string,
) {
  return prisma.$transaction(async (prisma) => {
    const data: AddMessageToChatData[] = [
      {
        messageContent: userMessage,
        role: ChatCompletionRequestMessageRoleEnum.User,
      },
    ];

    if (systemPrompt) {
      const messageCount = await prisma.message.count({
        where: {
          chatId: chat.id,
        },
      });
      if (messageCount === 0) {
        data.unshift({
          messageContent: systemPrompt,
          role: ChatCompletionRequestMessageRoleEnum.System,
        });
      }
    }

    await prisma.message.createMany({
      data: data.map(({ messageContent, role }) => ({
        content: messageContent,
        role,
        accountId: chat.accountId,
        chatId: chat.id,
      })),
    });

    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  });
}
