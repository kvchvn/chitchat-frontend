'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import {
  useCommunityActionsSelector,
  useUsersListSelector,
} from '~/store/selectors/community-selectors';
import { Nullable } from '~/types/global';
import { isUserRelevantWithStatus } from '~/types/guards';
import { UserRelevant, UserRelevantWithStatus, UsersCategoriesName } from '~/types/users';
import { UserItem } from './user-item';
import { UserItemControls } from './user-item-controls';

type UsersListProps = {
  session: Nullable<Session>;
  users: (UserRelevant | UserRelevantWithStatus)[];
  category: UsersCategoriesName;
};

export function UsersList({ users: usersFromProps, category, session }: UsersListProps) {
  const usersList = useUsersListSelector();
  const { setUsersList, resetUsersList } = useCommunityActionsSelector();

  useEffect(() => {
    setUsersList(usersFromProps);

    return () => {
      resetUsersList();
    };
  }, [setUsersList, resetUsersList, usersFromProps]);

  return (
    <SessionProvider session={session}>
      {(usersList ?? usersFromProps).length ? (
        <ul className="flex flex-col gap-4">
          {(usersList ?? usersFromProps).map((user) => (
            <UserItem key={user.id} user={user}>
              <UserItemControls
                userId={user.id}
                category={category}
                status={isUserRelevantWithStatus(user) ? user.status : undefined}
              />
            </UserItem>
          ))}
        </ul>
      ) : (
        <p>There are nobody</p>
      )}
    </SessionProvider>
  );
}
