import {
  useMessageContextMenuActionsSelector,
  useMessageContextMenuSelector,
  useMessageEditModeActionsSelector,
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
import { MutableRefObject, useEffect, useRef } from 'react';

type MessageContextMenuProps = {
  chatId: string;
  parentRef: MutableRefObject<Nullable<HTMLDivElement>>;
};

export function MessageContextMenu({ chatId, parentRef }: MessageContextMenuProps) {
  const { isOpen, messageId, coordinates } = useMessageContextMenuSelector();
  const { closeContextMenu } = useMessageContextMenuActionsSelector();
  const { turnOnEditMode } = useMessageEditModeActionsSelector();
  const socket = useSocketSelector();

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        !contextMenuRef.current?.contains(target) ||
        (contextMenuRef.current.contains(target) && target.tagName === 'BUTTON')
      ) {
        closeContextMenu();
      }
    };

    if (isOpen) {
      if (parentRef.current) {
        parentRef.current.style.overflow = 'hidden';
      }
      document.body.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (parentRef.current) {
        parentRef.current.style.overflow = 'auto';
      }
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

  return isOpen ? (
    <div
      ref={contextMenuRef}
      className="fixed z-10 rounded-xl border border-black bg-stone-200 py-2 shadow-md shadow-gray-800"
    >
      <ul className="flex flex-col gap-1">
        <li className="cursor-pointer py-1 pl-2 pr-4 text-sm hover:bg-stone-300">
          <button onClick={handleRemoveMessage}>Remove</button>
        </li>
        <li className="cursor-pointer py-1 pl-2 pr-4 text-sm hover:bg-stone-300">
          <button>Edit</button>
        </li>
      </ul>
    </div>
  ) : null;
}
