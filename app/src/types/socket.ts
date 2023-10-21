import { Message } from '@prisma/client';
import { Socket } from 'socket.io-client';
import { Nullable } from '.';

export type SocketEvents<T extends Record<string, Nullable<object>>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type ServerToClientListenersArgs = {
  'message:create': Nullable<Message>;
  'message:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:remove': { messageId: string };
};

export type ClientToServerListenersArgs = {
  'message:create': { chatId: string; senderId: string; content: string };
  'message:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:remove': { chatId: string; messageId: string };
};

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
