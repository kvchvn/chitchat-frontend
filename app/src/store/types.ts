import { ChatsRecord, CustomSocket, Nullable } from '@/types';
import { Message } from '@prisma/client';
import { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>;

export type SocketSlice = {
  socket: Nullable<CustomSocket>;
  setSocket: (socket: Socket) => void;
  resetSocket: () => void;
};

export type Store = SocketSlice;
