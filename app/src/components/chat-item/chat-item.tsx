import { DEFAULT_USERNAME, NO_MESSAGES_TEXT, ROUTES } from '@/constants';
import { ChatsRecord } from '@/types';
import { UserAvatar } from '@/ui/user-avatar';
import { getTime } from '@/utils';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    router.push(ROUTES.chat(id));
  };

  if (!session) {
    return null;
  }

  return (
    <li
      onClick={handleClick}
      className="h-22 flex gap-3 border-t p-2 last-of-type:border-b hover:cursor-pointer hover:bg-stone-100"
    >
      <div className="relative h-12 w-12 shrink-0">
        <UserAvatar
          username={friend.name}
          src={friend.image}
          className={classNames('rounded-full border-2 border-gray-600', {
            'scale-75 grayscale': isDisabled,
          })}
        />
      </div>
      <div className="flex h-full max-w-[70%] flex-col">
        <p>{friend.name ?? DEFAULT_USERNAME}</p>
        <p className="truncate text-sm text-gray-600">
          {lastMessage ? (
            <>
              {lastMessage.content}
              <span className="ml-1 font-mono text-gray-400">
                [{getTime(lastMessage.createdAt)}]
              </span>
            </>
          ) : (
            NO_MESSAGES_TEXT
          )}
        </p>
      </div>
      {unreadMessagesCount && lastMessage && lastMessage.senderId !== session.user.id ? (
        <span className="my-auto ml-auto h-7 w-7 rounded-full bg-orange-500 text-center font-mono leading-7 text-white">
          {unreadMessagesCount <= 9 ? unreadMessagesCount : '9+'}
        </span>
      ) : null}
    </li>
  );
}
