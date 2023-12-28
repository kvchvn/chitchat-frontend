import { ChatSlice, ImmerStateCreator } from '../types';

export const chatSlice: ImmerStateCreator<ChatSlice> = (set) => ({
  chats: null,
  selectedChat: null,
  chatActions: {
    setSelectedChat: ({ chatId, isDisabled }) =>
      set((state) => {
        state.selectedChat = { chatId, isDisabled };
      }),
    resetSelectedChat: () =>
      set((state) => {
        state.selectedChat = null;
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
