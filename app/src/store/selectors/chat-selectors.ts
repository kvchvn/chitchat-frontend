import { useMergedStore } from '../store';

export const useChatsSelector = () => useMergedStore((state) => state.chats);

export const useSelectedChatSelector = () => useMergedStore((state) => state.selectedChat);

export const useChatActionsSelector = () => useMergedStore((state) => state.chatActions);
