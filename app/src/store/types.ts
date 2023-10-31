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
  selectedChatId: Nullable<string>;
  messages: Nullable<Message[]>;
  chatActions: {
    setSelectedChatId: (chatId: string) => void;
    resetSelectedChatId: () => void;
    setMessages: (messages: Message[]) => void;
    resetMessages: () => void;
    setChats: (chats: ChatsRecord) => void;
    resetChats: () => void;
    clearChat: (chatId: string) => void;
    pushMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
    editMessage: (args: { messageId: string; content: string }) => void;
    incrementUnseenMessagesCount: (args: {
      chatId: string;
      newLastMessage: Pick<Message, 'senderId' | 'content'>;
    }) => void;
    resetUnseenMessageCount: (chatId: string) => void;
  };
};

export type MessageSlice = {
  contextMenu: {
    isOpen: boolean;
    messageId: Nullable<string>;
    messageSenderId: Nullable<string>;
    messageContent: Nullable<string>;
    coordinates: Nullable<{ x: number; y: number }>;
  };
  contextMenuActions: {
    openContextMenu: (args: {
      messageId: string;
      messageSenderId: string;
      messageContent: string;
      coordinates: { x: number; y: number };
    }) => void;
    closeContextMenu: () => void;
  };
  editMode: {
    isOn: boolean;
    messageId: Nullable<string>;
    messageContent: Nullable<string>;
  };
  editModeActions: {
    turnOnEditMode: () => void;
    turnOffEditMode: () => void;
  };
};

export type Store = SocketSlice & ChatSlice & MessageSlice;
