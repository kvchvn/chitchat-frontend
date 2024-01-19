import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserAvatar } from '~/components/ui/user-avatar';
import { ROUTES } from '~/constants/global';
import { ChatsRecord } from '~/types/chats';
import { UserAvatarContainer } from '../ui/user-avatar-container';
import { UserAvatarStatus } from '../ui/user-avatar-status';
import { ChatPreview } from './chat-preview';
import { ChatUnreadMessagesCount } from './chat-unread-messages-count';
import { DisabledChatPreview } from './disabled-chat-preview';

type ChatItemProps = {
  id: string;
  chat: ChatsRecord[''];
};

export function ChatItem({
  id,
  chat: {
    isDisabled,
    lastMessage,
    unreadMessagesCount,
    users: [friend],
  },
}: ChatItemProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return null;
  }

  const handleClick = () => {
    router.push(ROUTES.chat(id));
  };

  return (
    <li
      onClick={handleClick}
      className="relative flex w-full items-center gap-3 border-t px-1 py-3 last-of-type:border-b hover:cursor-pointer hover:bg-primary-base-50 dark:hover:bg-primary-base-800"
    >
      <UserAvatarContainer className="relative h-12 w-12 shrink-0">
        <UserAvatar
          username={friend.name}
          src={friend.image}
          className="rounded-full border border-primary-outline-dark dark:border-primary-outline-light"
        />
        <UserAvatarStatus size="md" userLatestSession={friend.sessions[0]} />
      </UserAvatarContainer>
      {isDisabled ? <DisabledChatPreview /> : <ChatPreview lastChatMessage={lastMessage} />}
      {lastMessage?.senderId !== session.user.id && (
        <ChatUnreadMessagesCount unreadMessagesCount={unreadMessagesCount} />
      )}
    </li>
  );
}
