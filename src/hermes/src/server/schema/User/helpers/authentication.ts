import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

import config from '../../../../config';
import { NexusGenAllTypes, NexusGenInputs } from '../../../../lib/types/nexus';
import { PrismaClient } from '@prisma/client';
import { createAppError } from '../../../../lib/utils/errors';

type User = NexusGenAllTypes['User'];
type LoginInput = NexusGenInputs['LoginInput'];

/**
 * Function that returns payload fron authorization string.
 *
 * @description
 * Server requests will contain a property "Authorization" whose value is "Bearer <token>".
 * The token is a jwt that can be used to authenticate and identify the user for each request.
 * The function takes that token and extracts the user object with jwt.verify
 *
 * @param authorization Authorization string from request headers.
 * @returns Payload object.
 */
export const authenticateUser = (authorization: string | undefined): User | null => {
  try {
    const bearerLength = 'Bearer '.length;
    if (!authorization || !(authorization.length > bearerLength)) return null;
    const reqToken = authorization.slice(bearerLength);

    const payload = jwt.verify(reqToken, config.jwtSecret);

    return (payload as any).user as User;
  } catch (e) {
    return null;
  }
};

/**
 * Function that hashes a password with argon2
 * @param password Inputed password string
 * @returns Hashed password
 */
export const createPassword = async (password: string) => {
  const passwordHash = await argon2.hash(password);
  return passwordHash;
};

/**
 *
 * Body of log in mutation
 * @returns Either a user object or an error
 */
export const loginUser = async (
  prisma: PrismaClient,
  input: LoginInput
): Promise<NexusGenAllTypes['UserResponse']> => {
  const { username, password } = input;

  const user = await prisma.user.findUnique({ where: { username } });

  // user does not exist guard clause
  if (!user) return { error: createAppError('username not found') };
  const isVerified = await argon2.verify(user.password, password);
  // incorrect password guard clause
  if (!isVerified) {
    return { error: createAppError('username or password is incorrect') };
  }
  const token = jwt.sign({ user }, config.jwtSecret, {
    expiresIn: '3 days'
  });
  const userWithToken = {
    ...user,
    token
  };
  return { user: userWithToken };
};

/**
 *
 * @param user User object coming from request
 * @param unAuthorizedRoles List of roles that are unauthorized
 * @returns boolean based on authroized
 */
export const isUserAuthorized = (user: User | null) => {
  if (!user) return false;

  return true;
};