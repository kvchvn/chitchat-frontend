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
  selectedChat: Nullable<{ chatId: string; isDisabled: boolean }>;
  chatActions: {
    setSelectedChat: (args: { chatId: string; isDisabled: boolean }) => void;
    resetSelectedChat: () => void;
    setChats: (chats: ChatsRecord) => void;
    resetChats: () => void;
    clearChat: (chatId: string) => void;
    incrementUnreadMessagesCount: (args: {
      chatId: string;
      newLastMessage: Pick<Message, 'senderId' | 'content' | 'createdAt'>;
    }) => void;
    resetUnreadMessageCount: (chatId: string) => void;
  };
};

export type MessageSlice = {
  messages: Nullable<Record<string, Message[]>>;
  messageActions: {
    setMessages: (messages: Record<string, Message[]>) => void;
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
    message: Nullable<Message>;
    coordinates: Nullable<{ x: number; y: number }>;
  };
  contextMenuActions: {
    openContextMenu: (args: { message: Message; coordinates: { x: number; y: number } }) => void;
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
