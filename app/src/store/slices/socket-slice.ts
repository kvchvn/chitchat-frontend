import { Socket } from 'socket.io-client';
import { ImmerStateCreator, SocketSlice } from '../types';

export const socketSlice: ImmerStateCreator<SocketSlice> = (set) => ({
  socket: null,
  socketActions: {
    setSocket: (socket: Socket) => set(() => ({ socket })),
    resetSocket: () => set(() => ({ socket: null })),
  },
});
