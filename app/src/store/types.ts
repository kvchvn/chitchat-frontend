import { Nullable } from '@/types';
import { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>;

export type SocketSlice = {
  socket: Nullable<Socket>;
  setSocket: (socket: Socket) => void;
  resetSocket: () => void;
};

export type Store = SocketSlice;
