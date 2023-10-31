import { useMessageContextMenuActionsSelector } from '@/store';
import { ChatRelevant } from '@/types';
import { Icon } from '@/ui/icon';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import styles from './chat-message.module.css';

type ChatMessageProps = {
  message: ChatRelevant['messages'][0];
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session } = useSession();
  const { openContextMenu } = useMessageContextMenuActionsSelector();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({
      messageId: message.id,
      messageSenderId: message.senderId,
      messageContent: message.content,
      coordinates: { x: e.clientX, y: e.clientY },
    });
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <li
        onContextMenu={handleContextMenu}
        className={classnames(
          'relative w-fit max-w-[45%] cursor-default whitespace-pre-line border px-3 py-1 overflow-anywhere',
          {
            'self-end rounded-t-xl rounded-bl-xl border-black bg-white':
              message.senderId === session.user.id,
            'rounded-t-xl rounded-br-xl border-sky-700 bg-sky-400 text-white':
              message.senderId !== session.user.id,
            [styles.seen]: message.senderId !== session.user.id && message.isSeen,
            [styles['not-seen']]: message.senderId !== session.user.id && !message.isSeen,
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
        {message.content}
      </li>
    </>
  );
}
