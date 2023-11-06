import { ImmerStateCreator, MessageSlice } from '../types';

export const messageSlice: ImmerStateCreator<MessageSlice> = (set) => ({
  messages: null,
  messageActions: {
    setMessages: (messages) =>
      set((state) => {
        state.messages = messages;
      }),
    resetMessages: () =>
      set((state) => {
        state.messages = null;
      }),
    createMessage: (message) =>
      set(({ messages }) => {
        if (messages) {
          console.log('createMessage - store');
          messages.push(message);
        }
      }),
    removeMessage: (messageId) =>
      set(({ messages }) => {
        if (messages) {
          const messageIndex = messages.findIndex((message) => message.id === messageId);
          if (messageIndex !== -1) {
            messages.splice(messageIndex, 1);
          }
        }
      }),
    editMessage: ({ messageId, content }) =>
      set(({ messages }) => {
        if (messages) {
          const message = messages.findLast((message) => message.id === messageId);
          if (message) {
            message.content = content;
            message.isEdited = true;
          }
        }
        state.contextMenu = {
          isOpen: false,
          messageId: null,
          messageSenderId: null,
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
          messageSenderId: null,
          coordinates: null,
        };
      }),
    turnOffEditMode: () =>
      set((state) => {
        state.editMode = { isOn: false, messageId: null, messageContent: null };
      }),
  },
});
