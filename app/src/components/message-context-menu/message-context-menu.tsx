import { useAdjustContextMenuPosition } from '@/hooks/use-adjust-context-menu-position';
import {
  useMessageContextMenuActionsSelector,
  useMessageContextMenuSelector,
  useMessageEditModeActionsSelector,
} from '@/store/selectors/message-managing-selectors';
import { useSocketSelector } from '@/store/selectors/socket-selectors';
import { Nullable } from '@/types/global';
import { disableScrolling, enableScrolling } from '@/utils/styles-managing';
import { useSession } from 'next-auth/react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
export { useSocketSelector } from '@/store/selectors/socket-selectors';

type MessageContextMenuProps = {
  chatId: string;
  parentRef: MutableRefObject<Nullable<HTMLDivElement>>;
};

export function MessageContextMenu({ chatId, parentRef }: MessageContextMenuProps) {
  const [isCopiedText, setIsCopiedText] = useState(false);

  const { isOpen, message, coordinates } = useMessageContextMenuSelector();
  const { closeContextMenu } = useMessageContextMenuActionsSelector();
  const { turnOnEditMode } = useMessageEditModeActionsSelector();
  const socket = useSocketSelector();
  const { data: session } = useSession();

  const contextMenuRef = useRef<Nullable<HTMLDivElement>>(null);

  useAdjustContextMenuPosition({ contextMenuRef, parentRef, initialCoordinates: coordinates });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!contextMenuRef.current?.contains(target)) {
        closeContextMenu();
      }
    };

    const parent = parentRef.current;

    if (isOpen) {
      setIsCopiedText(false);
      disableScrolling(parent);
      document.body.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (isOpen) {
        enableScrolling(parent);
        document.body.removeEventListener('click', handleClickOutside);
      }
    };
  }, [closeContextMenu, isOpen, parentRef]);

  if (!session || !socket || !message) {
    return null;
  }

  const handleRemoveMessage = () => {
    socket.emit('message:remove', { chatId, messageId: message.id });
    closeContextMenu();
  };

  const handleEditMessage = () => {
    turnOnEditMode();
  };

  const handleReactToMessage = () => {
    if (session.user.id !== message.senderId) {
      socket.emit('message:react', {
        chatId: message.chatId,
        messageId: message.id,
        reactions: { isLiked: !message.isLiked },
      });
      closeContextMenu();
    }
  };

  const handleCopyMessageContent = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopiedText(true);
  };

  return isOpen ? (
    <div
      ref={contextMenuRef}
      className="fixed z-10 rounded-xl border border-black bg-stone-200 py-3"
    >
      <ul className="flex flex-col gap-2">
        <li>
          <button onClick={handleRemoveMessage} className="btn-context-menu">
            Remove
          </button>
        </li>
        {session.user.id === message.senderId ? (
          <li>
            <button onClick={handleEditMessage} className="btn-context-menu">
              Edit
            </button>
          </li>
        ) : null}
        {session.user.id !== message.senderId ? (
          <li>
            <button onClick={handleReactToMessage} className="btn-context-menu">
              {message.isLiked ? 'Unlike' : 'Like'}
            </button>
          </li>
        ) : null}
        <li>
          <button
            onClick={handleCopyMessageContent}
            disabled={isCopiedText}
            className="btn-context-menu"
          >
            {isCopiedText ? 'Copied' : 'Copy'}
          </button>
        </li>
      </ul>
    </div>
  ) : null;
}
