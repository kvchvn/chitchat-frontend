import { ROUTES } from './global';

export const USERS_CATEGORIES: Record<
  Exclude<
    (typeof ROUTES.community)[keyof typeof ROUTES.community],
    (typeof ROUTES.community)['base']
  >,
  string
> = {
  [ROUTES.community.all]: 'All',
  [ROUTES.community.friends]: 'Friends',
  [ROUTES.community.incomingRequests]: 'Incoming requests',
  [ROUTES.community.outcomingRequests]: 'Outcoming requests',
};
