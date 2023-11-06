import { useMergedStore } from '..';

export const useMessageContextMenuSelector = () => useMergedStore((state) => state.contextMenu);

export const useMessageContextMenuActionsSelector = () =>
  useMergedStore((state) => state.contextMenuActions);

export const useMessageEditModeSelector = () => useMergedStore((state) => state.editMode);

export const useMessageEditModeActionsSelector = () =>
  useMergedStore((state) => state.editModeActions);
