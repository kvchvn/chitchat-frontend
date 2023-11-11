import { ChatHeader } from '@/components/chat-header';
import { ChatMessagesList } from '@/components/chat-messages-list';
import { EditedMessagePreview } from '@/components/edited-message-preview';
import { MessageContextMenu } from '@/components/message-context-menu';
import { MessageForm } from '@/components/message-form';
import { ROUTES } from '@/constants';
import {
  useChatActionsSelector,
  useMessageActionsSelector,
  useMessagesSelector,
  useSelectedChatSelector,
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
import { Icon } from '@/ui/icon';
import { getChatById } from '@/utils';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { useEffect, useRef } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ChatPage({
  session,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const messages = useMessagesSelector();
  const { setSelectedChat, resetSelectedChat } = useChatActionsSelector();
  const { setMessages, resetMessages } = useMessageActionsSelector();
  const selectedChat = useSelectedChatSelector();
  const socket = useSocketSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  console.log('ChatPage RENDER', { chatId: chat?.id, socketId: socket?.id, messages });
  useEffect(() => {
    if (socket && chat) {
      console.log('useEffect (lastMessage)');

      // initial messages array filling
      setMessages(chat.messages);
      setSelectedChat({ chatId: chat.id, isDisabled: chat.isDisabled });

      const lastMessage = Object.values(chat.messages).at(-1)?.at(-1);

      if (lastMessage && lastMessage.senderId !== session.user.id && !lastMessage.isRead) {
        // this request is handled to "read" all unread messages in the chat
        socket.emit('chat:read', { chatId: chat.id });
      }

      return () => {
        console.log('useEffect (lastMessage) return');
        resetMessages();
        resetSelectedChat();
        socket.emit('chat:read', { chatId: chat.id });
      };
    }
  }, [
    chat,
    socket,
    session.user.id,
    setMessages,
    setSelectedChat,
    resetMessages,
    resetSelectedChat,
  ]);

  return (
    <>
      {!chat ? (
        <p>Fetching error</p>
      ) : (
        <section className="flex h-full flex-col">
          <ChatHeader chatId={chat.id} chatUsers={chat.users} />
          <div
            ref={containerRef}
            className="relative flex h-full flex-col gap-2 overflow-y-auto border-t border-black bg-stone-100 px-2 pb-8 pt-1"
          >
            <MessageContextMenu chatId={chat.id} parentRef={containerRef} />
            {messages && <ChatMessagesList messages={messages} />}
          </div>
          <EditedMessagePreview />
          {selectedChat?.isDisabled ? (
            <div className="flex items-center gap-2 bg-rose-100 p-1">
              <span className="h-6 w-6">
                <Icon id="warning" />
              </span>
              <p className="text-sm text-rose-800">
                You should add to friends the user to send messages.
              </p>
            </div>
          ) : (
            <MessageForm chatId={chat.id} userId={session.user.id} />
          )}
        </section>
      )}
    </>
  );
}

export const getServerSideProps = (async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.signIn,
      },
    };
  }

  const chat = await getChatById(ctx.params?.id as string);

  if (chat && !chat.users.find((user) => user.id === session.user.id)) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.chats,
      },
    };
  }

  return {
    props: {
      session,
      chat,
    },
  };
}) satisfies GetServerSideProps;
