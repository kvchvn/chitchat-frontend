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
  useSocketSelector,
} from '@/store';
import { Nullable } from '@/types';
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
  const { setSelectedChatId, resetSelectedChatId } = useChatActionsSelector();
  const { setMessages, resetMessages } = useMessageActionsSelector();
  const socket = useSocketSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  console.log('ChatPage RENDER', { chatId: chat?.id, socketId: socket?.id, messages });
  useEffect(() => {
    if (socket && chat) {
      console.log('useEffect (lastMessage)');

      // initial messages array filling
      setMessages(chat.messages);
      setSelectedChatId(chat.id);

      const lastMessage = chat.messages.at(-1);

      if (lastMessage && lastMessage.senderId !== session.user.id && !lastMessage.isRead) {
        // this request is handled to "read" all unread messages in the chat
        socket.emit('chat:read', { chatId: chat.id });
      }

      return () => {
        console.log('useEffect (lastMessage) return');
        resetMessages();
        resetSelectedChatId();
        socket.emit('chat:read', { chatId: chat.id });
      };
    }
  }, [
    chat,
    socket,
    session.user.id,
    setMessages,
    setSelectedChatId,
    resetMessages,
    resetSelectedChatId,
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
            className="relative h-full overflow-y-auto border-t border-black bg-stone-100 px-2 pb-8 pt-1"
          >
            <MessageContextMenu chatId={chat.id} parentRef={containerRef} />
            {messages && <ChatMessagesList messages={messages} />}
          </div>
          <EditedMessagePreview />
          <MessageForm chatId={chat.id} userId={session.user.id} />
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
