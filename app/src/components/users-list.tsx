import { Nullable, UserRelevant, UsersListVariant } from '@/types';
import UserItem from './user-item';

type UsersListProps = {
  variant: UsersListVariant;
  listName: string;
  users: Nullable<UserRelevant[]>;
  emptinessMessage?: string;
};

export default function UsersList({
  variant,
  users,
  listName,
  emptinessMessage = "There aren't anybody here.",
}: UsersListProps) {
  return (
    <>
      <h4 className="mb-2 mt-6 font-semibold">{listName}:</h4>
      {users ? (
        users.length ? (
          <ul className="flex flex-col gap-3">
            {users.map((user) => (
              <li key={user.id}>
                <UserItem listVariant={variant} user={user} />
              </li>
            ))}
          </ul>
        ) : (
          <p>{emptinessMessage}</p>
        )
      ) : (
        <p>Error occurred during fetching {listName.toLowerCase()}.</p>
      )}
    </>
  );
}
