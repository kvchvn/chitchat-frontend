import { ChatSlice, ImmerStateCreator } from '../types';

export const chatSlice: ImmerStateCreator<ChatSlice> = (set) => ({
  messages: null,
  chats: null,
  selectedChatId: null,
  chatActions: {
    setSelectedChatId: (chatId) =>
      set((state) => {
        state.selectedChatId = chatId;
      }),
    resetSelectedChatId: () =>
      set((state) => {
        state.selectedChatId = null;
      }),
    setMessages: (messages) =>
      set((state) => {
        state.messages = messages;
      }),
    resetMessages: () =>
      set((state) => {
        state.messages = null;
      }),
    setChats: (chats) =>
      set((state) => {
        state.chats = chats;
      }),
    resetChats: () =>
      set((state) => {
        state.chats = null;
      }),
    clearChat: (chatId) =>
      set(({ chats, messages }) => {
        if (chats && chatId in chats) {
          chats[chatId].lastMessage = undefined;
          chats[chatId].unseenMessagesCount = 0;
        }
        if (messages) {
          messages.length = 0;
        }
      }),
    pushMessage: (message) =>
      set(({ messages }) => {
        if (messages) {
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
          const message = messages.find((message) => message.id === messageId);
          if (message) {
            message.content = content;
          }
        }
      }),
    incrementUnseenMessagesCount: ({ chatId, newLastMessage }) =>
      set(({ chats }) => {
        if (chats && chatId in chats) {
          chats[chatId].unseenMessagesCount += 1;
          chats[chatId].lastMessage = newLastMessage;
        }
      }),
    resetUnseenMessageCount: (chatId) =>
      set(({ chats }) => {
        if (chats && chatId in chats) {
          chats[chatId].unseenMessagesCount = 0;
        }
      }),
  },
});
