import { prisma } from '@/lib/prisma';

export type CreateOrUpdateAccountPayload = {
  email: string;
  name: string;
  picture: string | null;
};

/**
 * Finds an existing account with the given email, or creates a new one if it doesn't exist.
 * @param payload - The payload containing the email, name, and picture URL for the account.
 * @returns The account that was found or created.
 */
export async function findOrCreateAccount(
  payload: CreateOrUpdateAccountPayload,
) {
  return prisma.account.upsert({
    where: {
      email: payload.email,
    },
    create: {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
    update: {},
  });
}
