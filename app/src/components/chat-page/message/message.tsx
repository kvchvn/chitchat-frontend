import { Message } from '@prisma/client';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import React from 'react';
import { UserAvatar } from '~/components/ui/user-avatar';
import { UserAvatarContainer } from '~/components/ui/user-avatar-container';
import { useMessageContextMenuActionsSelector } from '~/store/selectors/message-managing-selectors';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { UserRelevant } from '~/types/users';
import { MessageStatusBar } from './message-status-bar';

type MessageProps = {
  message: Message;
  isFirstMessageBySender: boolean;
  isLastMessageBySender: boolean;
  sender: Omit<UserRelevant, 'email' | 'id'> | undefined;
};

export function Message({
  message,
  isFirstMessageBySender,
  isLastMessageBySender,
  sender,
}: MessageProps) {
  const { data: session } = useSession();
  const { openContextMenu } = useMessageContextMenuActionsSelector();
  const socket = useSocketSelector();

  if (!session) {
    return null;
  }

  const isCurrentUser = message.senderId === session.user.id;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({ message, coordinates: { x: e.clientX, y: e.clientY } });
  };

  const handleDoubleClick = () => {
    if (socket && !isCurrentUser) {
      socket.emit('message:react', {
        chatId: message.chatId,
        messageId: message.id,
        reactions: { isLiked: !message.isLiked },
      });
    }
  };

  return (
    <li
      className={classnames('flex items-end gap-2', {
        'mb-2': isLastMessageBySender,
      })}
    >
      <UserAvatarContainer
        className={classnames('hidden h-8 w-8 md:block', {
          invisible: !isLastMessageBySender,
        })}
      >
        <UserAvatar username={sender?.name} src={sender?.image} className="rounded-full" />
      </UserAvatarContainer>
      <div
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        className={classnames(
          'relative w-fit max-w-[45%] cursor-pointer select-none whitespace-pre-line border p-2 overflow-anywhere',
          {
            'ml-auto border-primary-base-400 bg-primary-base-50 dark:border-primary-base-300 dark:bg-primary-bg-light dark:text-primary-outline-dark md:ml-0':
              isCurrentUser,
            'border-sky-600 bg-sky-300 text-primary-base-50 dark:border-sky-800 dark:bg-sky-600':
              !isCurrentUser,
            'rounded-t-lg rounded-bl-lg md:rounded-bl-none md:rounded-br-lg':
              isFirstMessageBySender && isCurrentUser,
            'rounded-t-lg rounded-br-lg': isFirstMessageBySender && !isCurrentUser,
            'rounded-l-lg md:rounded-l-none md:rounded-r-lg':
              !isFirstMessageBySender && !isLastMessageBySender && isCurrentUser,
            'rounded-r-lg': !isFirstMessageBySender && !isLastMessageBySender && !isCurrentUser,
            'rounded-b-lg rounded-tl-lg md:rounded-tl-none md:rounded-tr-lg':
              isLastMessageBySender && isCurrentUser,
            'rounded-b-lg rounded-tr-lg': isLastMessageBySender && !isCurrentUser,
            '!rounded-lg': isFirstMessageBySender && isLastMessageBySender,
          }
        )}
      >
        <p>{message.content}</p>
        <MessageStatusBar message={message} isCurrentUser={isCurrentUser} />
      </div>
    </li>
  );
}
