import { ChatsRecord, CustomSocket, Nullable, Reactions } from '@/types';
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
  chatActions: {
    setSelectedChatId: (chatId: string) => void;
    resetSelectedChatId: () => void;
    setChats: (chats: ChatsRecord) => void;
    resetChats: () => void;
    clearChat: (chatId: string) => void;
    incrementUnreadMessagesCount: (args: {
      chatId: string;
      newLastMessage: Pick<Message, 'senderId' | 'content'>;
    }) => void;
    resetUnreadMessageCount: (chatId: string) => void;
  };
};

export type MessageSlice = {
  messages: Nullable<Message[]>;
  messageActions: {
    setMessages: (messages: Message[]) => void;
    resetMessages: () => void;
    createMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
    editMessage: (args: { messageId: string; content: string }) => void;
    reactToMessage: (args: { messageId: string; reactions: Reactions }) => void;
  };
};

export type MessageManagingSlice = {
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

export type Store = SocketSlice & ChatSlice & MessageSlice & MessageManagingSlice;
