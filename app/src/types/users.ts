import { User } from '@prisma/client';

export type UsersCategories = 'all' | 'friends' | 'incomingRequests' | 'outcomingRequests';

export enum UserStatus {
  Default = 'default',
  Me = 'me',
  Friend = 'friend',
  FriendRequestToMeSender = 'friend-request-sender',
  FriendRequestFromMeReceiver = 'friend-request-receiver',
}

export type UserRelevant = Omit<User, 'emailVerified'>;

export type UserRelevantWithStatus = UserRelevant & { status: UserStatus };
