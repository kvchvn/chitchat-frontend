import { ImmerStateCreator, MessageSlice } from '../types';

export const messageSlice: ImmerStateCreator<MessageSlice> = (set) => ({
  contextMenu: {
    messageId: null,
    messageContent: null,
    isOpen: false,
    coordinates: null,
  },
  contextMenuActions: {
    openContextMenu: ({ messageId, messageContent, coordinates }) =>
      set((state) => {
        state.contextMenu = { messageId, messageContent, isOpen: true, coordinates };
      }),
    closeContextMenu: () =>
      set((state) => {
        state.contextMenu = {
          isOpen: false,
          messageId: null,
          messageContent: null,
          coordinates: null,
        };
      }),
  },
  editMode: {
    isOn: false,
    messageId: null,
    messageContent: null,
  },
  editModeActions: {
    turnOnEditMode: () =>
      set((state) => {
        const { messageId, messageContent } = state.contextMenu;
        state.editMode = { isOn: true, messageId, messageContent };
        state.contextMenu = {
          isOpen: false,
          messageId: null,
          messageContent: null,
          coordinates: null,
        };
      }),
    turnOffEditMode: () =>
      set((state) => {
        state.editMode = { isOn: false, messageId: null, messageContent: null };
      }),
  },
});
