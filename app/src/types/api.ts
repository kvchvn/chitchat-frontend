import { ChatsRecord, ExtendedChatWithMessagesRecord } from './chats';
import { UserRelevant, UserRelevantWithStatus, UsersCategoriesCount } from './users';

// common

export type ErrorResponse = {
  data: null;
  status: number;
  message: string;
  issues?: string[];
};

export type Response<T> =
  | {
      data: T;
    }
  | ErrorResponse;

// users

export type UserResponse = Response<UserRelevant>;

export type AllUsersResponse = Response<UserRelevantWithStatus[]>;

export type UsersResponse = Response<UserRelevant[]>;

export type UsersCategoriesCountResponse = Response<UsersCategoriesCount>;

export type UserChatsResponse = Response<ChatsRecord>;

export type UserOperationResponse = Response<{ isOperationPerformed: boolean }>;

export type UserOperationResponseWithAdditionalData<
  AdditionalData extends Record<string, unknown>,
> = Response<{ isOperationPerformed: boolean } & AdditionalData>;

// chats

export type ChatResponse = Response<ExtendedChatWithMessagesRecord>;
