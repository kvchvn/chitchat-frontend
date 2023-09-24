import { Nullable } from '@/types';
import { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>;

export type SocketSlice = {
  socket: Nullable<Socket>;
  connectToSocket: (socket: Socket) => void;
  disconnectFromSocket: () => void;
};

export type Store = SocketSlice;
