import { PrismaClient } from '@prisma/client';

export const findUsername = async (prisma: PrismaClient, username: string) => {
  const user = await prisma.user.findFirst({ where: { username } });

  return !!user;
};

export const findEmail = async (prisma: PrismaClient, email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });

  return !!user;
};
