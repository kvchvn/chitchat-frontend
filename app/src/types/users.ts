import { Session, User } from '@prisma/client';

export type UsersCategories = 'all' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export enum UsersCategoriesName {
  All = 'All',
  Friends = 'Friends',
  IncomingRequests = 'Incoming requests',
  OutcomingRequests = 'Outcoming requests',
}

export enum UserStatus {
  Default = 'default',
  Me = 'me',
  Friend = 'friend',
  FriendRequestToMeSender = 'friend-request-sender',
  FriendRequestFromMeReceiver = 'friend-request-receiver',
}

export type UserRelevant = Omit<User, 'emailVerified'> & { sessions: Pick<Session, 'expires'>[] };

export type UserRelevantWithStatus = UserRelevant & { status: UserStatus };

export type UsersCategoriesCount = {
  [Property in UsersCategories]: number;
};
