import { UserCounts, UserRelevant, UsersListVariant } from '@/types';
import Image from 'next/image';
import ButtonsBox from './buttons-box';

type UserItemProps = {
  listVariant: UsersListVariant;
  user: UserRelevant & { _count?: UserCounts };
};

export function UserItem({ listVariant, user }: UserItemProps) {
  return (
    <div className="flex items-center gap-5">
      {user.image && (
        <Image
          src={user.image}
          width={30}
          height={30}
          alt={`${user.name} avatar`}
          className="rounded-full"
        />
      )}
      <p>{user.name || 'Anonymous'}</p>
      <ButtonsBox
        listVariant={listVariant}
        isFriendOrRequested={Boolean(
          user._count &&
            (user._count.friends || user._count.incomingRequests || user._count.outcomingRequests)
        )}
        currentUserId={user.id}
      />
    </div>
  );
}
