import { PropsWithChildren } from 'react';
import { UserRelevant, UserRelevantWithStatus } from '~/types/users';
import { UserAvatar } from '~/ui/user-avatar';
import { isUserOnline } from '~/utils/is-user-online';

type UserItemProps = PropsWithChildren & {
  user: UserRelevant | UserRelevantWithStatus;
};

export function UserItem({ user, children: childrenControls }: UserItemProps) {
  return (
    <li className="flex h-10 w-full items-center gap-2">
      <div className="relative h-full w-10">
        <UserAvatar
          src={user.image}
          username={user.name}
          className="rounded-full border-2 border-black "
        />
        {isUserOnline(user) && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-black bg-green-600" />
        )}
      </div>
      <p>
        {user.name} <span className="font-mono text-gray-500">({user.email})</span>
      </p>
      <div className="ml-auto border-2 border-blue-600 bg-sky-300 px-3 py-1 hover:bg-sky-500">
        {childrenControls}
      </div>
    </li>
  );
}
