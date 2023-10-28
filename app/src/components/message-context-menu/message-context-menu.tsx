import {
  useMessageContextMenuActionsSelector,
  useMessageContextMenuSelector,
  useMessageEditModeActionsSelector,
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
import { disableScrolling, enableScrolling } from '@/utils';
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
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

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
        <li className="cursor-pointer text-sm hover:bg-stone-300">
          <button onClick={handleEditMessage} className="w-full py-1 pl-2 pr-4 text-start">
            Edit
          </button>
        </li>
      </ul>
    </div>
  ) : null;
}
