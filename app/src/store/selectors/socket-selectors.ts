import { useMergedStore } from '..';

export const useSocketSelector = () => useMergedStore((state) => state.socket);

export const useSocketActionsSelector = () =>
  useMergedStore((state) => ({
    setSocket: state.setSocket,
    resetSocket: state.resetSocket,
  }));
