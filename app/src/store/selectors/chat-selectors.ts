import { useMergedStore } from '..';

export const useChatsSelector = () => useMergedStore((state) => state.chats);

export const useSelectedChatIdSelector = () => useMergedStore((state) => state.selectedChatId);

export const useChatActionsSelector = () => useMergedStore((state) => state.chatActions);
