import { UsersCategories, UsersCategoriesName } from '~/types/users';
import { ROUTES } from './global';

export const USERS_CATEGORIES: Record<
  Exclude<
    (typeof ROUTES.community)[keyof typeof ROUTES.community],
    (typeof ROUTES.community)['base']
  >,
  { name: UsersCategoriesName; label: UsersCategories }
> = {
  [ROUTES.community.all]: { name: UsersCategoriesName.All, label: 'all' },
  [ROUTES.community.friends]: { name: UsersCategoriesName.Friends, label: 'friends' },
  [ROUTES.community.incomingRequests]: {
    name: UsersCategoriesName.IncomingRequests,
    label: 'incomingRequests',
  },
  [ROUTES.community.outcomingRequests]: {
    name: UsersCategoriesName.OutcomingRequests,
    label: 'outcomingRequests',
  },
};
