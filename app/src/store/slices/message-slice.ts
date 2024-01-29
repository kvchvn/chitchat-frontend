import { getDateAsKey } from '~/utils/date';
import { ImmerStateCreator, MessageSlice } from '../types';

export const messageSlice: ImmerStateCreator<MessageSlice> = (set) => ({
  messages: null,
  messagesLength: 0,
  messageActions: {
    setMessages: (messages) =>
      set((state) => {
        state.messages = messages;
      }),
    setMessagesLength: (length) =>
      set((state) => {
        state.messagesLength = length;
      }),
    resetMessages: () =>
      set((state) => {
        state.messages = null;
      }),
    resetMessagesLength: () =>
      set((state) => {
        state.messagesLength = 0;
      }),
    createMessage: (message) =>
      set((state) => {
        if (state.messages) {
          const key = getDateAsKey(message.createdAt);
          if (key in state.messages) {
            state.messages[key].push(message);
          } else {
            state.messages[key] = [message];
          }

          state.messagesLength++;
        }
      }),
    removeMessage: (messageId) =>
      set((state) => {
        if (state.messages) {
          for (const [key, nestedMessages] of Object.entries(state.messages).toReversed()) {
            const messageIndex = nestedMessages.findLastIndex(
              (message) => message.id === messageId
            );

            if (messageIndex !== -1) {
              state.messages[key].splice(messageIndex, 1);
              state.messagesLength--;
              break;
            }
          }
        }
      }),
    removeFirstMessageByDate: ({ messageId, messageCreatedAt }) =>
      set((state) => {
        if (state.messages) {
          const dateAsKey = getDateAsKey(messageCreatedAt);

          if (dateAsKey in state.messages) {
            const firstMessageByDate = state.messages[dateAsKey][0];

            if (firstMessageByDate && firstMessageByDate.id === messageId) {
              state.messages[dateAsKey].splice(0, 1);
              state.messagesLength--;
            }
          }
        }
      }),
    editMessage: ({ messageId, content }) =>
      set(({ messages }) => {
        if (messages) {
          for (const nestedMessages of Object.values(messages).toReversed()) {
            const message = nestedMessages.findLast((message) => message.id === messageId);

            if (message) {
              message.content = content;
              message.isEdited = true;
              break;
            }
          }
        }
      }),
    reactToMessage: ({ messageId, reactions }) =>
      set(({ messages }) => {
        if (messages) {
          for (const nestedMessages of Object.values(messages).toReversed()) {
            const message = nestedMessages.findLast((message) => message.id === messageId);

            if (message) {
              Object.assign(message, reactions);
              break;
            }
          }
        }
      }),
    readMessages: () =>
      set(({ messages }) => {
        if (messages) {
          const messagesArr = Object.values(messages).at(-1);

          if (messagesArr) {
            for (let i = messagesArr.length - 1; i >= 0; i--) {
              const message = messagesArr[i];
              if (message.isRead) {
                break;
              } else {
                message.isRead = true;
              }
            }
          }
        }
      }),
  },
});
