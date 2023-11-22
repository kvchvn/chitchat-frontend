import { ChatsRecord, ExtendedChatWithMessagesRecord } from './chats';
import { Nullable } from './global';
import { UserRelevant, UserRelevantWithStatus, UsersCategories } from './users';

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

export type UserResponse = Response<Nullable<UserRelevant>>;

export type AllUsersResponse = Response<UserRelevantWithStatus[]>;

export type UsersResponse = Response<UserRelevant[]>;

export type UsersCategoriesAmountResponse = {
  [Property in UsersCategories]: number;
};

export type FriendRequestResponse = Response<{
  requestReceiver: UserRelevant;
  isAccepted: boolean;
}>;

// chats

export type UserChatsResponse = Response<ChatsRecord>;

export type ChatResponse = Response<ExtendedChatWithMessagesRecord>;
