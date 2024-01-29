import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Icon } from '~/components/ui/icon';
import { UserAvatar } from '~/components/ui/user-avatar';
import { DEFAULT_USER } from '~/constants/chats';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { UserAvatarContainer } from '../ui/user-avatar-container';
import { UserAvatarStatus } from '../ui/user-avatar-status';

type Props = {
  chatId: string;
  chatUsers: ExtendedChatWithMessagesRecord['users'];
};

export function ChatHeader({ chatId, chatUsers }: Props) {
  const { data: session } = useSession();

  const [friend] = useState(() =>
    session
      ? Object.entries(chatUsers).find(([userId]) => userId !== session.user.id)?.[1]
      : undefined
  );
  const socket = useSocketSelector();
  const router = useRouter();

  const handleClearChat = () => {
    socket?.emit('chat:clear', { chatId });
  };

  return (
    <header className="flex items-center gap-2 pb-3">
      <button
        onClick={router.back}
        className="hover: h-10 w-10 rounded-full border-2 border-primary-outline-dark hover:bg-primary-bg-lighter dark:border-primary-outline-light dark:hover:bg-primary-bg-darker"
      >
        <Icon id="chevron-left" />
      </button>
      <UserAvatarContainer className="h-10 w-10 rounded-full">
        <UserAvatar
          username={friend?.name}
          src={friend?.image}
          className="rounded-full border-2 border-primary-outline-dark dark:border-primary-outline-light"
        />
        <UserAvatarStatus userLatestSession={friend?.sessions[0]} hiddenOffline={false} size="sm" />
      </UserAvatarContainer>
      <h3 className="text-lg">{friend?.name ?? DEFAULT_USER.name}</h3>
      <button
        onClick={handleClearChat}
        className="ml-auto h-10 w-10 rounded-full border-2 border-error-base-light bg-error-bg-light p-1 hover:bg-error-hover-light dark:border-error-base-dark dark:bg-error-bg-dark dark:hover:bg-error-hover-dark"
      >
        <Icon id="basket" className="!fill-error-base-light dark:!fill-error-base-dark" />
      </button>
    </header>
  );
}
