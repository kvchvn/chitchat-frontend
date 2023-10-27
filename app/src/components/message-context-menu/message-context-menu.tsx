import {
  useMessageContextMenuActionsSelector,
  useMessageContextMenuSelector,
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react';

type MessageContextMenuProps = {
  chatId: string;
  parentRef: MutableRefObject<Nullable<HTMLDivElement>>;
};

export function MessageContextMenu({ chatId, parentRef }: MessageContextMenuProps) {
  const { isOpen, chosenMessageId, coordinates } = useMessageContextMenuSelector();
  const { closeContextMenu } = useMessageContextMenuActionsSelector();
  const socket = useSocketSelector();

  const contextMenuRef = useRef<Nullable<HTMLDivElement>>(null);

  const handleRemoveMessage = () => {
    if (socket && chosenMessageId) {
      socket.emit('message:remove', { chatId, messageId: chosenMessageId });
    }
  };

  useLayoutEffect(() => {
    if (contextMenuRef.current && parentRef.current && coordinates) {
      const DELTA = 10;

      const { width: contextMenuWidth, height: contextMenuHeight } =
        contextMenuRef.current.getBoundingClientRect();

      const {
        width: parentWidth,
        left: parentLeft,
        top: parentTop,
      } = parentRef.current.getBoundingClientRect();

      const left =
        parentLeft + parentWidth - coordinates.x > contextMenuWidth + DELTA
          ? coordinates.x
          : coordinates.x - contextMenuWidth;

      const top =
        coordinates.y - parentTop < contextMenuHeight + DELTA
          ? coordinates.y
          : coordinates.y - contextMenuHeight;

      contextMenuRef.current.style.left = `${left}px`;
      contextMenuRef.current.style.top = `${top}px`;

      if (coordinates.x > left) {
        if (coordinates.y > top) {
          contextMenuRef.current.style.borderBottomRightRadius = '0';
        } else {
          contextMenuRef.current.style.borderTopRightRadius = '0';
        }
      } else {
        if (coordinates.y > top) {
          contextMenuRef.current.style.borderBottomLeftRadius = '0';
        } else {
          contextMenuRef.current.style.borderTopLeftRadius = '0';
        }
      }

      return () => {
        if (contextMenuRef.current) {
          contextMenuRef.current.style.borderRadius = '';
        }
      };
    }
  }, [coordinates, parentRef]);

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
      document.body.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

  return isOpen ? (
    <div
      ref={contextMenuRef}
      className="fixed z-10 rounded-xl border border-black bg-stone-200 py-2"
    >
      <ul className="flex flex-col gap-1">
        <li className="cursor-pointer py-1 pl-2 pr-4 text-sm font-light hover:bg-stone-300">
          <button onClick={handleRemoveMessage}>Remove</button>
        </li>
        <li className="cursor-pointer py-1 pl-2 pr-4 text-sm font-light hover:bg-stone-300">
          <button>Edit</button>
        </li>
      </ul>
    </div>
  ) : null;
}
