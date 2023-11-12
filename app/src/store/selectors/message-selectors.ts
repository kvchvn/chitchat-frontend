import { useMergedStore } from '..';

export const useMessagesSelector = () => useMergedStore((state) => state.messages);

export const useMessageActionsSelector = () => useMergedStore((state) => state.messageActions);
