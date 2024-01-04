import { getDateAsKey } from '~/utils/date';
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
          const key = getDateAsKey(message.createdAt);
          if (key in messages) {
            messages[key].push(message);
          } else {
            messages[key] = [message];
          }
        }
      }),
    removeMessage: (messageId) =>
      set(({ messages }) => {
        if (messages) {
          for (const [key, nestedMessages] of Object.entries(messages).toReversed()) {
            const messageIndex = nestedMessages.findLastIndex(
              (message) => message.id === messageId
            );

            if (messageIndex !== -1) {
              messages[key].splice(messageIndex, 1);
              break;
            }
          }
        }
      }),
    removeFirstMessageByDate: ({ messageId, messageCreatedAt }) =>
      set(({ messages }) => {
        if (messages) {
          const dateAsKey = getDateAsKey(messageCreatedAt);

          if (dateAsKey in messages) {
            const firstMessageByDate = messages[dateAsKey][0];

            if (firstMessageByDate && firstMessageByDate.id === messageId) {
              messages[dateAsKey].splice(0, 1);
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
