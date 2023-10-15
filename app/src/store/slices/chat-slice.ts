import { ChatSlice, ImmerStateCreator } from '../types';

export const chatSlice: ImmerStateCreator<ChatSlice> = (set) => ({
  messages: null,
  chats: null,
  setMessages: (messages) =>
    set((state) => {
      state.messages = messages;
    }),
  setChats: (chats) =>
    set((state) => {
      state.chats = chats;
    }),
  removeMessagesFromChat: (chatId) =>
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
});
