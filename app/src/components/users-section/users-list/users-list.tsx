import { Users } from '@/types';
import { UserItem } from './user-item';

type UsersListProps = {
  users: Users[keyof Users];
};

export function UsersList({ users }: UsersListProps) {
  if (!users) {
    return <p>Error</p>;
  }

  return (
    <div>
      <ul>
        {users.length ? (
          users.map((user) => <UserItem key={user.id} user={user} />)
        ) : (
          <p>There are nobody</p>
        )}
      </ul>
    </div>
  );
}
