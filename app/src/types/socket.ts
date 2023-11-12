import { Message } from '@prisma/client';
import { Socket } from 'socket.io-client';
import { Nullable } from '.';

export type SocketEvents<T extends Record<string, Nullable<object>>> = {
  [Property in keyof T]: (args: T[Property]) => void;
};

export type Reactions = {
  [Property in Extract<keyof Message, 'isLiked'>]: boolean;
};

export type ServerToClientListenersArgs = {
  'chat:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:create': Nullable<Message>;
  'message:remove': { messageId: string };
  'message:edit': { messageId: string; content: Message['content'] };
  'message:react': { messageId: string; reactions: Reactions };
};

export type ClientToServerListenersArgs = {
  'chat:read': { chatId: string };
  'chat:clear': { chatId: string };
  'message:create': { chatId: string; senderId: string; content: string };
  'message:remove': { chatId: string; messageId: string };
  'message:edit': { chatId: string; messageId: string; updatedContent: Message['content'] };
  'message:react': { chatId: string; messageId: string; reactions: Reactions };
};

export type ServerToClientEvents = SocketEvents<ServerToClientListenersArgs>;

export type ClientToServerEvents = SocketEvents<ClientToServerListenersArgs>;

export type CustomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
