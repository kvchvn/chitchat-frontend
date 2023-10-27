import { useMergedStore } from '..';

export const useMessageContextMenuSelector = () => useMergedStore((state) => state.contextMenu);

export const useMessageContextMenuActionsSelector = () =>
  useMergedStore((state) => state.contextMenuActions);
