import { ROUTES } from '~/constants/global';
import { ErrorResponse } from './api';
import { UserRelevant, UserRelevantWithStatus, UserStatus } from './users';

export const isErrorResponse = (err: unknown): err is ErrorResponse =>
  Boolean(
    err &&
      typeof err === 'object' &&
      'data' in err &&
      !err.data &&
      'status' in err &&
      typeof err.status === 'number' &&
      'message' in err &&
      typeof err.message === 'string'
  );

export const isUserRelevantWithStatus = (user: UserRelevant): user is UserRelevantWithStatus =>
  Boolean(
    'status' in user &&
      typeof user.status === 'string' &&
      (user.status === UserStatus.Default ||
        user.status === UserStatus.Friend ||
        user.status === UserStatus.FriendRequestFromMeReceiver ||
        user.status === UserStatus.FriendRequestToMeSender ||
        user.status === UserStatus.Me)
  );

export const isCommunityPathname = (
  pathname: string
): pathname is Exclude<
  (typeof ROUTES.community)[keyof typeof ROUTES.community],
  (typeof ROUTES.community)['base']
> =>
  Boolean(
    pathname === ROUTES.community.all ||
      pathname === ROUTES.community.friends ||
      pathname === ROUTES.community.incomingRequests ||
      pathname === ROUTES.community.outcomingRequests
  );
