import { useAdjustContextMenuPosition } from '@/hooks';
import {
  useMessageContextMenuActionsSelector,
  useMessageContextMenuSelector,
  useMessageEditModeActionsSelector,
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
import { disableScrolling, enableScrolling } from '@/utils';
import { useSession } from 'next-auth/react';
import { MutableRefObject, useEffect, useRef } from 'react';

type MessageContextMenuProps = {
  chatId: string;
  parentRef: MutableRefObject<Nullable<HTMLDivElement>>;
};

export function MessageContextMenu({ chatId, parentRef }: MessageContextMenuProps) {
  const { isOpen, message, coordinates } = useMessageContextMenuSelector();
  const { closeContextMenu } = useMessageContextMenuActionsSelector();
  const { turnOnEditMode } = useMessageEditModeActionsSelector();
  const socket = useSocketSelector();
  const { data: session } = useSession();

  const contextMenuRef = useRef<Nullable<HTMLDivElement>>(null);

  const handleRemoveMessage = () => {
    if (socket && messageId) {
      socket.emit('message:remove', { chatId, messageId });
      closeContextMenu();
    }
  };

  const handleEditMessage = () => {
    if (socket && messageId) {
      turnOnEditMode();
    }
  };

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

  return isOpen ? (
    <div
      ref={contextMenuRef}
      className="fixed z-10 rounded-xl border border-black bg-stone-200 py-2"
    >
      <ul className="flex flex-col gap-1">
        <li className="cursor-pointer text-sm hover:bg-stone-300">
          <button onClick={handleRemoveMessage} className="w-full py-1 pl-2 pr-4 text-start">
            Remove
          </button>
        </li>
        {session && messageSenderId && session.user.id === messageSenderId ? (
          <li className="cursor-pointer text-sm hover:bg-stone-300">
            <button onClick={handleEditMessage} className="w-full py-1 pl-2 pr-4 text-start">
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
      </ul>
    </div>
  ) : null;
}
