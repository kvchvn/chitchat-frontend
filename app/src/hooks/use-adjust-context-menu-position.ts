import { Nullable } from '@/types';
import { MutableRefObject, useEffect } from 'react';

type UseAdjustContextMenuPositionArgs<T, U> = {
  contextMenuRef: MutableRefObject<Nullable<T>>;
  parentRef: MutableRefObject<Nullable<U>>;
  initialCoordinates: Nullable<{ x: number; y: number }>;
};

export const useAdjustContextMenuPosition = <
  ContextMenuType extends HTMLElement,
  ParentType extends HTMLElement,
>({
  contextMenuRef,
  parentRef,
  initialCoordinates,
}: UseAdjustContextMenuPositionArgs<ContextMenuType, ParentType>) => {
  useEffect(() => {
    if (contextMenuRef.current && parentRef.current && initialCoordinates) {
      const DELTA = 10;
      const contextMenu = contextMenuRef.current;

      const { width: contextMenuWidth, height: contextMenuHeight } =
        contextMenu.getBoundingClientRect();

      const {
        width: parentWidth,
        left: parentLeft,
        top: parentTop,
      } = parentRef.current.getBoundingClientRect();

      const left =
        parentLeft + parentWidth - initialCoordinates.x > contextMenuWidth + DELTA
          ? initialCoordinates.x
          : initialCoordinates.x - contextMenuWidth;

      const top =
        initialCoordinates.y - parentTop < contextMenuHeight + DELTA
          ? initialCoordinates.y
          : initialCoordinates.y - contextMenuHeight;

      contextMenu.style.left = `${left}px`;
      contextMenu.style.top = `${top}px`;

      if (initialCoordinates.x > left) {
        if (initialCoordinates.y > top) {
          contextMenu.style.borderBottomRightRadius = '0';
        } else {
          contextMenu.style.borderTopRightRadius = '0';
        }
      } else {
        if (initialCoordinates.y > top) {
          contextMenu.style.borderBottomLeftRadius = '0';
        } else {
          contextMenu.style.borderTopLeftRadius = '0';
        }
      }

      return () => {
        contextMenu.style.borderRadius = '';
      };
    }
  }, [initialCoordinates, parentRef, contextMenuRef]);
};
