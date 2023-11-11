import { Chat, Message } from '@prisma/client';
import { Nullable, UserCounts, UserRelevant } from '.';

export type ErrorResponse = {
  ok: false;
  status: number;
  message: string;
  issues?: string[];
};

export type Users = {
  allUsersExceptOneself: Nullable<(UserRelevant & { _count: UserCounts })[]>;
  friends: Nullable<UserRelevant[]>;
  incomingRequests: Nullable<UserRelevant[]>;
  outcomingRequests: Nullable<UserRelevant[]>;
};

export type ChatRelevant = Chat & { messages: Record<string, Message[]> } & {
  users: UserRelevant[];
};

export type ChatsRecord = Record<
  string,
  {
    isDisabled: boolean;
    lastMessage: Pick<Message, 'content' | 'senderId' | 'createdAt'> | undefined;
    users: UserRelevant[];
    unreadMessagesCount: number;
  }
>;
