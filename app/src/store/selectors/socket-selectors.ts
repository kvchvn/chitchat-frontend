import { useMergedStore } from '..';

export const useSocketSelector = () => useMergedStore((state) => state.socket);

export const useSocketActionsSelector = () => useMergedStore((state) => state.socketActions);
