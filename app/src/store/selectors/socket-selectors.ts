import { useMergedStore } from '..';

export const useSocketSelector = () => useMergedStore((state) => state.socket);

export const useSocketActionsSelector = () =>
  useMergedStore(({ setSocket, resetSocket }) => ({ setSocket, resetSocket }));
