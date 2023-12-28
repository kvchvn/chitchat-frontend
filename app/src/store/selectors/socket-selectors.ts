import { useMergedStore } from '../store';

export const useSocketSelector = () => useMergedStore((state) => state.socket);

export const useSocketActionsSelector = () => useMergedStore((state) => state.socketActions);
