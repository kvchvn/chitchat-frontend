import { isUserRelevantWithStatus } from '~/types/guards';
import { UserRelevant, UserRelevantWithStatus, UsersCategoriesName } from '~/types/users';
import { UserItem } from './user-item';
import { UserItemControls } from './user-item-controls';

type UsersListProps = {
  users: (UserRelevant | UserRelevantWithStatus)[];
  category: UsersCategoriesName;
};

export function UsersList({ users, category }: UsersListProps) {
  return users.length ? (
    <ul className="flex flex-col gap-4">
      {users.map((user) => (
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
  );
}
