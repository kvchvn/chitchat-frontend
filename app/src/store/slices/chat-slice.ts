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
    setChats: (chats) =>
      set((state) => {
        state.chats = chats;
      }),
    resetChats: () =>
      set((state) => {
        state.chats = null;
      }),
    clearChat: (chatId) =>
      set(({ chats }) => {
        if (chats && chatId in chats) {
          chats[chatId].lastMessage = undefined;
          chats[chatId].unreadMessagesCount = 0;
        }
      }),
    incrementUnreadMessagesCount: ({ chatId, newLastMessage }) =>
      set(({ chats }) => {
        if (chats && chatId in chats) {
          chats[chatId].unreadMessagesCount += 1;
          chats[chatId].lastMessage = newLastMessage;
        }
      }),
    resetUnreadMessageCount: (chatId) =>
      set(({ chats }) => {
        if (chats && chatId in chats) {
          chats[chatId].unreadMessagesCount = 0;
        }
      }),
  },
});
