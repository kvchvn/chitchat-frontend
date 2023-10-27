import { ChatsRecord, CustomSocket, Nullable } from '@/types';
import { Message } from '@prisma/client';
import { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

export type ImmerStateCreator<T> = StateCreator<T, [['zustand/immer', never], never], [], T>;

export type SocketSlice = {
  socket: Nullable<CustomSocket>;
  socketActions: {
    setSocket: (socket: Socket) => void;
    resetSocket: () => void;
  };
};

export type ChatSlice = {
  chats: Nullable<ChatsRecord>;
  messages: Nullable<Message[]>;
  chatActions: {
    setMessages: (messages: Nullable<Message[]>) => void;
    setChats: (chats: Nullable<ChatsRecord>) => void;
    removeMessagesFromChat: (chatId: string) => void;
    pushMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
    incrementUnseenMessagesCount: (args: {
      chatId: string;
      newLastMessage: Pick<Message, 'senderId' | 'content'>;
    }) => void;
    resetUnseenMessageCount: (chatId: string) => void;
  };
};

export type MessageSlice = {
  contextMenu: {
    chosenMessageId: Nullable<string>;
    isOpen: boolean;
    coordinates: Nullable<{ x: number; y: number }>;
  };
  contextMenuActions: {
    openContextMenu: (args: { messageId: string; coordinates: { x: number; y: number } }) => void;
    closeContextMenu: () => void;
  };
};

export type Store = SocketSlice & ChatSlice & MessageSlice;
