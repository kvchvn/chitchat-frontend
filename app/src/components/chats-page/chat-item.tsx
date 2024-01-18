import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserAvatar } from '~/components/ui/user-avatar';
import { NO_MESSAGES_TEXT } from '~/constants/chats';
import { ROUTES } from '~/constants/global';
import { ChatsRecord } from '~/types/chats';
import { getTime } from '~/utils/date';
import { UserAvatarContainer } from '../ui/user-avatar-container';
import { UserAvatarStatus } from '../ui/user-avatar-status';
import { ChatUnreadMessagesCount } from './chat-unread-messages-count';

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
      <div className="flex max-w-[60%] flex-col">
        {lastMessage ? (
          <>
            <p className="truncate text-sm text-primary-base-600 dark:text-primary-base-200">
              {lastMessage.content}
            </p>
            <p className="font-mono text-xs text-gray-400">[{getTime(lastMessage.createdAt)}]</p>
          </>
        ) : (
          <p className="text-sm text-gray-400">{NO_MESSAGES_TEXT}</p>
        )}
      </div>
      {lastMessage?.senderId !== session.user.id && (
        <ChatUnreadMessagesCount unreadMessagesCount={unreadMessagesCount} />
      )}
    </li>
  );
}
