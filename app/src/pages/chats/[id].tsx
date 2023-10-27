import { ChatHeader } from '@/components/chat-header';
import { ChatMessagesList } from '@/components/chat-messages-list';
import { MessageContextMenu } from '@/components/message-context-menu';
import { NO_MESSAGES_TEXT, ROUTES } from '@/constants';
import { useChatActionsSelector, useMessagesSelector, useSocketSelector } from '@/store';
import { Nullable } from '@/types';
import { getChatById, logError } from '@/utils';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ChatPage({
  session,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState('');

  const messages = useMessagesSelector();
  const { setMessages } = useChatActionsSelector();
  const socket = useSocketSelector();

  const containerRef = useRef<Nullable<HTMLDivElement>>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      if (!chat) {
        throw new Error('There are no chat or/and friend.');
      }
      if (!socket) {
        throw new Error('Socket is not connected.');
      }

      const trimmedMessage = messageContent.trim();

      if (trimmedMessage) {
        socket.emit('message:create', {
          chatId: chat.id,
          senderId: session.user.id,
          content: trimmedMessage,
        });
      }
    } catch (err) {
      logError('Chat Page (handleSubmit): ', err);
    } finally {
      setMessageContent('');
    }
  };

  useEffect(() => {
    if (socket && chat) {
      const lastMessage = chat.messages.at(-1);
      if (lastMessage && lastMessage.senderId !== session.user.id) {
        socket.emit('message:read', { chatId: chat.id });
      }
    }
  }, [chat, socket, session.user.id]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Enter' || e.key === 'Enter') && messageContent && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  });

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    }

    return () => {
      setMessages(null);
    };
  }, [chat, setMessages]);

  return (
    <>
      {!chat ? (
        <p>Fetching error</p>
      ) : (
        <section className="flex h-full flex-col">
          <ChatHeader chatId={chat.id} chatUsers={chat.users} />
          <div
            ref={containerRef}
            className="relative h-[85%] overflow-y-auto border-t border-black bg-stone-100 px-2 pb-8 pt-1"
          >
            <MessageContextMenu chatId={chat.id} parentRef={containerRef} />
            {messages && messages.length ? (
              <ChatMessagesList messages={messages} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-light text-stone-500">{NO_MESSAGES_TEXT}</p>
              </div>
            )}
          </div>
          <form className="flex h-[7%] border-t border-black p-1">
            <textarea
              name="message"
              placeholder="Write your message here..."
              autoFocus
              value={messageContent}
              maxLength={150}
              onChange={handleChange}
              className="h-full w-full resize-none outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageContent}
              className="text-cyan h-10 self-end rounded-full border-2 border-cyan-900 bg-cyan-300 px-3 py-1 hover:bg-cyan-500 disabled:grayscale"
            >
              Send
            </button>
          </form>
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
