import { Message } from '@prisma/client';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Icon } from '~/components/ui/icon';
import { useMessageContextMenuActionsSelector } from '~/store/selectors/message-managing-selectors';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { MessageStatusBar } from './message-status-bar';

type MessageProps = {
  message: Message;
};

export function Message({ message }: MessageProps) {
  const { data: session } = useSession();
  const { openContextMenu } = useMessageContextMenuActionsSelector();
  const socket = useSocketSelector();

  if (!session) {
    return null;
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({ message, coordinates: { x: e.clientX, y: e.clientY } });
  };

  const handleDoubleClick = () => {
    if (socket && session.user.id !== message.senderId) {
      socket.emit('message:react', {
        chatId: message.chatId,
        messageId: message.id,
        reactions: { isLiked: !message.isLiked },
      });
    }
  };

  return (
    <li
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      className={classnames(
        'overflow-anywhere relative w-fit max-w-[45%] cursor-pointer select-none whitespace-pre-line border px-3 py-1',
        {
          'ml-auto self-end rounded-t-xl rounded-bl-xl border-black bg-white':
            message.senderId === session.user.id,
          'rounded-t-xl rounded-br-xl border-cyan-800 bg-cyan-500 text-white':
            message.senderId !== session.user.id,
        }
      )}
    >
      {message.isEdited && (
        <span
          className={classnames('absolute bottom-0 block h-4 w-4 opacity-70', {
            '-left-5': message.senderId === session.user.id,
            '-right-5': message.senderId !== session.user.id,
          })}
        >
          <Icon id="pencil" />
        </span>
      )}
      {message.isLiked && (
        <span
          className={classnames('absolute -bottom-2 block h-5 w-5', {
            '-left-2': message.senderId === session.user.id,
            '-right-2': message.senderId !== session.user.id,
          })}
        >
          <Icon id="heart" />
        </span>
      )}
      <p>{message.content}</p>
        <MessageStatusBar message={message} isCurrentUser={isCurrentUser} />
      </div>
    </li>
  );
}
