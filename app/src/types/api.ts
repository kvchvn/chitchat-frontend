import { Chat, Message } from '@prisma/client';
import { Nullable, UserRelevant } from '.';

export type ErrorResponse = {
  ok: false;
  status: number;
  message: string;
  issues?: string[];
};

export type UserKeys = 'allUsers' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export type Users = {
  [Property in UserKeys]: Nullable<UserRelevant[]>;
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
