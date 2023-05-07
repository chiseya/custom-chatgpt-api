import { prisma } from '../../lib/prisma';

export type CreateOrUpdateAccountPayload = {
  email: string;
  name: string;
  picture: string | null;
};

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
