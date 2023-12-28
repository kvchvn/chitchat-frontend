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
  const { setMessages, resetMessages } = useMessageActionsSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

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

      if (lastMessage && lastMessage.senderId !== userId && !lastMessage.isRead) {
        socket.emit('chat:read', { chatId: chat.id });
      }
    }
  }, [socket, chat.id, messages, userId]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col gap-2 overflow-y-auto border-t border-black bg-stone-100 px-2 pb-8 pt-1"
    >
      <MessageContextMenu chatId={chat.id} parentRef={containerRef} />
      <MessagesList messages={messages ?? chat.messages} />
    </div>
  );
}
