import { ImmerStateCreator, MessageSlice } from '../types';

export const messageSlice: ImmerStateCreator<MessageSlice> = (set) => ({
  contextMenu: {
    chosenMessageId: null,
    isOpen: false,
    coordinates: null,
  },
  contextMenuActions: {
    openContextMenu: ({ messageId, coordinates }) =>
      set((state) => {
        state.contextMenu = { chosenMessageId: messageId, isOpen: true, coordinates };
      }),
    closeContextMenu: () =>
      set((state) => {
        state.contextMenu = { chosenMessageId: null, isOpen: false, coordinates: null };
      }),
  },
});
