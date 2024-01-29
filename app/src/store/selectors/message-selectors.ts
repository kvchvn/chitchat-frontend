import { useMergedStore } from '../store';

export const useMessagesSelector = () => useMergedStore((state) => state.messages);

export const useMessagesLengthSelector = () => useMergedStore((state) => state.messagesLength);

export const useMessageActionsSelector = () => useMergedStore((state) => state.messageActions);
