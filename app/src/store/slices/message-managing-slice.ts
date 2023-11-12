import { ImmerStateCreator, MessageManagingSlice } from '../types';

export const messageManagingSlice: ImmerStateCreator<MessageManagingSlice> = (set) => ({
  contextMenu: {
    isOpen: false,
    message: null,
    coordinates: null,
  },
  contextMenuActions: {
    openContextMenu: ({ message, coordinates }) =>
      set((state) => {
        state.contextMenu = {
          message,
          isOpen: true,
          coordinates,
        };
      }),
    closeContextMenu: () =>
      set((state) => {
        state.contextMenu = {
          isOpen: false,
          message: null,
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
        const { message } = state.contextMenu;
        if (message) {
          state.editMode = { isOn: true, messageId: message.id, messageContent: message.content };
          state.contextMenu = {
            isOpen: false,
            message: null,
            coordinates: null,
          };
        }
      }),
    turnOffEditMode: () =>
      set((state) => {
        state.editMode = { isOn: false, messageId: null, messageContent: null };
      }),
  },
});
