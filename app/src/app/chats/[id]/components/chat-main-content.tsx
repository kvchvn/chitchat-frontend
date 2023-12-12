'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import {
  useMessageActionsSelector,
  useMessagesSelector,
} from '~/store/selectors/message-selectors';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { ChatMessagesList } from './chat-messages-list';
import { DisabledChatMessage } from './disabled-chat-message';
import { EditedMessagePreview } from './edited-message-preview';
import { MessageContextMenu, useSocketSelector } from './message-context-menu';
import { MessageForm } from './message-form';

type ChatMainContentProps = {
  chat: ExtendedChatWithMessagesRecord;
  session: Nullable<Session>;
};

export function ChatMainContent({ chat, session }: ChatMainContentProps) {
  const messages = useMessagesSelector();
  const { setSelectedChat, resetSelectedChat } = useChatActionsSelector();
  const { setMessages, resetMessages } = useMessageActionsSelector();
  const socket = useSocketSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

  console.log('ChatPage RENDER');

  useEffect(() => {
    setMessages(chat.messages);
    setSelectedChat({ chatId: chat.id, isDisabled: chat.isDisabled });

    return () => {
      resetMessages();
      resetSelectedChat();
    };
  }, [chat, setMessages, setSelectedChat, resetMessages, resetSelectedChat]);

  useEffect(() => {
    if (messages && socket) {
      const lastMessage = Object.values(messages).at(-1)?.at(-1);

      if (lastMessage && lastMessage.senderId !== session?.user.id && !lastMessage.isRead) {
        socket.emit('chat:read', { chatId: chat.id });
      }
    }
  }, [socket, chat, messages, session?.user.id]);

  return (
    <SessionProvider session={session}>
      <div
        ref={containerRef}
        className="relative flex h-full flex-col gap-2 overflow-y-auto border-t border-black bg-stone-100 px-2 pb-8 pt-1"
      >
        <MessageContextMenu parentRef={containerRef} />
        <ChatMessagesList messages={messages ?? chat.messages} />
      </div>
      <EditedMessagePreview />
      {!chat.isDisabled ? <MessageForm chatId={chat.id} /> : <DisabledChatMessage />}
    </SessionProvider>
  );
}
