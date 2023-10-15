import { useMergedStore } from '..';

export const useMessagesSelector = () => useMergedStore((state) => state.messages);

export const useChatsSelector = () => useMergedStore((state) => state.chats);

export const useChatActionsSelector = () =>
  useMergedStore(
    ({
      pushMessage,
      setMessages,
      setChats,
      incrementUnseenMessagesCount,
      resetUnseenMessageCount,
      removeMessagesFromChat,
    }) => ({
      pushMessage,
      setMessages,
      setChats,
      incrementUnseenMessagesCount,
      resetUnseenMessageCount,
      removeMessagesFromChat,
    })
  );
