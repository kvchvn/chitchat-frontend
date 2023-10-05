import { Chat, Message } from '@prisma/client';
import { Nullable, UserCounts, UserRelevant } from '.';

export type ErrorResponse = {
  ok: false;
  status: number;
  message: string;
  issues?: string[];
};

export type GetUsersResponse = {
  allUsersExceptOneself: Nullable<(UserRelevant & { _count: UserCounts })[]>;
  friends: Nullable<UserRelevant[]>;
  incomingRequests: Nullable<UserRelevant[]>;
  outcomingRequests: Nullable<UserRelevant[]>;
};

export type ChatWithMessages = Chat & { messages: Message[] };
