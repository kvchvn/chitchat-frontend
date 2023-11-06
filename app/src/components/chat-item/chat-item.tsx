import { DEFAULT_USERNAME, NO_MESSAGES_TEXT, ROUTES } from '@/constants';
import { ChatsRecord } from '@/types';
import { UserAvatar } from '@/ui/user-avatar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type ChatItemProps = {
  id: string;
  chat: ChatsRecord[''];
};

export function ChatItem({
  id,
  chat: {
    lastMessage,
    unreadMessagesCount,
    users: [friend],
  },
}: ChatItemProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    router.push(ROUTES.chat(id));
  };

  if (!session) {
    return null;
  }

  return (
    <li onClick={handleClick} className="h-22 flex gap-3 border-t p-2 hover:cursor-pointer">
      <div className="relative h-12 w-12">
        <UserAvatar
          username={friend.name}
          src={friend.image}
          className="rounded-full border-2 border-gray-600"
        />
      </div>
      <div className="flex h-full flex-col">
        <p>{friend.name ?? DEFAULT_USERNAME}</p>
        <p className="text-sm text-gray-500">
          {lastMessage ? lastMessage.content : NO_MESSAGES_TEXT}
        </p>
      </div>
      {unreadMessagesCount && lastMessage && lastMessage.senderId !== session.user.id ? (
        <span className="my-auto ml-auto h-9 w-9 rounded-full bg-blue-400 text-center leading-9 text-white">
          {unreadMessagesCount <= 9 ? unreadMessagesCount : '9+'}
        </span>
      ) : null}
    </li>
  );
}
