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
    <header className="flex items-center gap-2 px-2 py-3">
      <button
        onClick={router.back}
        className="hover: h-8 w-8 rounded-full border border-black p-1 hover:bg-slate-100"
      >
        <Icon id="return" />
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
        className="ml-auto h-8 w-8 rounded-full border border-red-900 bg-red-100 p-1 text-white hover:bg-red-200"
      >
        <Icon id="basket" />
      </button>
    </header>
  );
}
