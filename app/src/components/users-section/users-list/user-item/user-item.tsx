import { UserRelevant } from '@/types';
import { useSession } from 'next-auth/react';

type UserItemProps = {
  user: UserRelevant;
};

export function UserItem({ user }: UserItemProps) {
  const { data: session } = useSession();

  if (!session || user.id === session.user.id) {
    return null;
  }

  return <li>{user.name}</li>;
}
