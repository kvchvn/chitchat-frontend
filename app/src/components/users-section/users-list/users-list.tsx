import { Users } from '@/types';
import { useContext } from 'react';
import { UserItem } from '../user-item';
import { UsersListContext } from '../users-list-provider';

type UsersListProps = {
  users: Users;
};

export function UsersList({ users }: UsersListProps) {
  const { listName } = useContext(UsersListContext);

  return (
    <div className="bg-stone-100 pt-4">
      {users[listName] ? (
        <ul className="flex flex-col">
          {users[listName]?.length ? (
            users[listName]?.map((user) => <UserItem key={user.id} user={user} />)
          ) : (
            <p>There are nobody</p>
          )}
        </ul>
      ) : (
        <p>Error</p>
      )}
    </div>
  );
}
