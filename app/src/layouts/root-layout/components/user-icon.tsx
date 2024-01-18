import { useSession } from 'next-auth/react';
import { UserAvatar } from '~/components/ui/user-avatar';
import { UserAvatarContainer } from '~/components/ui/user-avatar-container';
import { UserAvatarStatus } from '~/components/ui/user-avatar-status';
import { useSocketSelector } from '~/store/selectors/socket-selectors';

export function UserIcon() {
  const { data: session } = useSession();
  const socket = useSocketSelector();

  return (
    <UserAvatarContainer
      onlineStatus={Boolean(socket)}
      hiddenOffline={false}
      className="relative mx-auto h-8 w-8"
    >
      <UserAvatar
        src={session?.user.image}
        username={session?.user.name}
        className="my-auto cursor-pointer rounded-full border border-primary-outline-dark dark:border-primary-outline-light"
      />
      <UserAvatarStatus size="sm" onlineStatus={Boolean(socket)} hiddenOffline={false} />
    </UserAvatarContainer>
  );
}
