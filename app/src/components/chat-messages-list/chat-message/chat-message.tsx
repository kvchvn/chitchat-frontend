import { useMessageContextMenuActionsSelector } from '@/store';
import { ChatRelevant } from '@/types';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';

type ChatMessageProps = {
  message: ChatRelevant['messages'][0];
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session } = useSession();
  const { openContextMenu } = useMessageContextMenuActionsSelector();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu({ messageId: message.id, coordinates: { x: e.clientX, y: e.clientY } });
  };

  if (!session) {
    return null;
  }

  return (
    <li
      onContextMenu={handleContextMenu}
      className={classnames(
        'w-fit max-w-[45%] cursor-default whitespace-pre-line border px-3 py-1 font-light overflow-anywhere',
        {
          'self-end rounded-t-xl rounded-bl-xl border-black bg-white':
            message.senderId === session.user.id,
          'rounded-t-xl rounded-br-xl border-sky-700 bg-sky-400 text-white':
            message.senderId !== session.user.id,
        }
      )}
    >
      {message.content}
    </li>
  );
}
