import { useMergedStore } from '..';

export const useMessagesSelector = () => useMergedStore((state) => state.messages);

export const useChatsSelector = () => useMergedStore((state) => state.chats);

export const useChatActionsSelector = () => useMergedStore((state) => state.chatActions);
