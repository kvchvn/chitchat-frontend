import { useMessageContextMenuActionsSelector, useSocketSelector } from '@/store';
import { ChatRelevant } from '@/types';
import { Icon } from '@/ui/icon';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';

type ChatMessageProps = {
  message: ChatRelevant['messages'][0];
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session } = useSession();
  const { openContextMenu } = useMessageContextMenuActionsSelector();
  const socket = useSocketSelector();

  if (!session) {
    return null;
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({
      messageId: message.id,
      messageSenderId: message.senderId,
      messageContent: message.content,
      coordinates: { x: e.clientX, y: e.clientY },
    });
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
        'relative w-fit max-w-[45%] cursor-pointer whitespace-pre-line border px-3 py-1 overflow-anywhere',
        {
          'self-end rounded-t-xl rounded-bl-xl border-black bg-white':
            message.senderId === session.user.id,
          'rounded-t-xl rounded-br-xl border-sky-700 bg-sky-400 text-white':
            message.senderId !== session.user.id,
        }
      )}
    >
      {message.isEdited && (
        <span
          className={classnames('absolute bottom-0 block h-4 w-4 opacity-50', {
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
      {message.content}
    </li>
  );
}
