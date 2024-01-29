import { Chat, Message } from '@prisma/client';
import { UserRelevant } from './users';

export type ExtendedChat = Chat & {
  messages: Pick<Message, 'content' | 'senderId' | 'createdAt'>[];
  users: UserRelevant[];
  _count: { messages: number };
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

export type MessagesRecord = Record<string, Message[]>;

export type ExtendedChatWithMessagesRecord = Chat & {
  users: Record<string, Omit<UserRelevant, 'email' | 'id'>>;
  messages: MessagesRecord;
};

export type UnreadChatsIds = {
  ids: string[];
};
