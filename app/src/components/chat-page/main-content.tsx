import { useEffect, useRef } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import {
  useMessageActionsSelector,
  useMessagesSelector,
} from '~/store/selectors/message-selectors';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { MessageContextMenu, useSocketSelector } from './message-context-menu';
import { MessagesList } from './messages-list';

type MainContentProps = {
  chat: ExtendedChatWithMessagesRecord;
  userId: string;
};

export function MainContent({ chat, userId }: MainContentProps) {
  const socket = useSocketSelector();
  const messages = useMessagesSelector();
  const { setSelectedChat, resetSelectedChat } = useChatActionsSelector();
  const { setMessages, resetMessages, setMessagesLength, resetMessagesLength } =
    useMessageActionsSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    setMessages(chat.messages);
    setMessagesLength(chat.messagesLength);
    setSelectedChat({ chatId: chat.id, isDisabled: chat.isDisabled });

    return () => {
      resetMessages();
      resetMessagesLength();
      resetSelectedChat();
    };
  }, [
    chat,
    setMessages,
    setSelectedChat,
    resetMessages,
    resetSelectedChat,
    setMessagesLength,
    resetMessagesLength,
  ]);

  useEffect(() => {
    if (messages && socket) {
      const lastMessage = Object.values(messages).at(-1)?.at(-1);

      if (lastMessage && lastMessage.senderId !== userId && !lastMessage.isRead) {
        socket.emit('chat:read', { chatId: chat.id });
      }
    }
  }, [socket, chat.id, messages, userId]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col gap-2 overflow-y-auto border-b border-t border-primary-outline-light bg-primary-bg-lightest px-2 pb-8 pt-1 scrollbar-stable dark:border-primary-bg-light dark:bg-primary-bg-dark"
    >
      <MessageContextMenu chatId={chat.id} parentRef={containerRef} />
      <MessagesList messages={messages ?? chat.messages} users={chat.users} />
    </div>
  );
}
