import { User } from '@prisma/client';
import { Session } from 'next-auth';

export type IconId = 'chat' | 'users' | 'sign-out' | 'user' | 'close-md' | 'return' | 'basket';

export type Nullable<T> = T | null;

export type UserCounts = {
  friends: number;
  incomingRequests: number;
  outcomingRequests: number;
};

export type UserRelevant = Omit<User, 'emailVerified'>;

export type PageProps = {
  session: Nullable<Session>;
};
