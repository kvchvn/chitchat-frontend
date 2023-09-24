import { Socket } from 'socket.io-client';
import { ImmerStateCreator, SocketSlice } from '../types';

export const socketSlice: ImmerStateCreator<SocketSlice> = (set) => ({
  socket: null,
  connectToSocket: (socket: Socket) => set(() => ({ socket })),
  disconnectFromSocket: () => set(() => ({ socket: null })),
});
