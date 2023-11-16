import { DEFAULT_USERNAME } from '@/constants';
import { UserRelevant } from '@/types';
import { UserAvatar } from '@/ui/user-avatar';
import { useSession } from 'next-auth/react';
import { UserItemControls } from '../user-item-controls';

type UserItemProps = {
  user: UserRelevant;
};

export function UserItem({ user }: UserItemProps) {
  const { data: session } = useSession();

  if (!session || user.id === session.user.id) {
    return null;
  }

  return (
    <li className="flex items-center gap-3 px-1 py-2">
      <div className="relative h-10 w-10">
        <UserAvatar
          username={user.name}
          src={user.image}
          className="rounded-full border-2 border-black"
        />
      </div>
      <p>{user.name ?? DEFAULT_USERNAME}</p>
      <UserItemControls status={user._count} />
    </li>
  );
}
