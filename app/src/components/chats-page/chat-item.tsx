import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NO_MESSAGES_TEXT } from '~/constants/chats';
import { ROUTES } from '~/constants/global';
import { ChatsRecord } from '~/types/chats';
import { UserAvatar } from '~/ui/user-avatar';
import { getTime } from '~/utils/date';
import { isUserOnline } from '~/utils/is-user-online';

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
      className="flex h-16 items-center gap-3 border-t last-of-type:border-b hover:cursor-pointer hover:bg-stone-100"
    >
      <div className="relative h-12 w-12 shrink-0">
        <UserAvatar
          username={friend.name}
          src={friend.image}
          className={classNames('rounded-full border-2 border-gray-600', {
            'scale-75 grayscale': isDisabled,
          })}
        />
        {isUserOnline(friend) && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-600 bg-green-600" />
        )}
      </div>
      <div className="flex max-w-[70%] flex-col">
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
