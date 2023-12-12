import { ImmerStateCreator, SocketSlice } from '../types';

export const socketSlice: ImmerStateCreator<SocketSlice> = (set) => ({
  socket: null,
  socketActions: {
    setSocket: (socket) =>
      set((state) => {
        // @ts-ignore: Type '(readonly any[])[]' is not assignable to type 'any[][]'.
        state.socket = socket;
      }),
    resetSocket: () =>
      set((state) => {
        state.socket = null;
      }),
  },
});
