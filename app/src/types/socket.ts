import { Socket } from 'socket.io-client';

export type SocketEvents<T extends Record<string, object>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type ServerToClientListenersArgs = {
  'message:create': { content: string; senderId: string };
};

export type ClientToServerListenersArgs = {
  'message:create': { chatId: string; senderId: string; content: string };
};

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
