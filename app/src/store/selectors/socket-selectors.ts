import { useMergedStore } from '..';

export const useSocketSelector = () => useMergedStore((state) => state.socket);

export const useSocketActionsSelector = () =>
  useMergedStore((state) => ({
    connectToSocket: state.connectToSocket,
    disconnectFromSocket: state.disconnectFromSocket,
  }));
