import { API_ENDPOINTS, NO_MESSAGES_TEXT, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { logError } from '@/lib';
import { useChatActionsSelector, useMessagesSelector, useSocketSelector } from '@/store';
import { ChatRelevant, Nullable } from '@/types';
import classNames from 'classnames';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ChatPage({
  session,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState('');

  const router = useRouter();

  const messages = useMessagesSelector();
  const { setMessages } = useChatActionsSelector();
  const socket = useSocketSelector();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!chat) {
        throw new Error('There are no chat or/and friend.');
      }
      if (!socket) {
        throw new Error('Socket is not connected.');
      }

      socket.emit('message:create', {
        chatId: chat.id,
        senderId: session.user.id,
        content: messageContent,
      });
    } catch (err) {
      logError('Chat Page (handleSubmit): ', err);
    }
    setMessageContent('');
  };

  const handleClick = () => {
    if (socket && chat) {
      socket.emit('chat:clear', { chatId: chat.id });
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
        <section className="flex h-full flex-col border border-red-900">
          <div className="flex h-[8%] items-center gap-4 border-b border-t border-gray-400 bg-gray-50 px-1 py-2">
            <button
              onClick={router.back}
              className="rounded-full border-2 border-black bg-gray-400 px-3 py-1 text-white hover:bg-gray-600"
            >
              Back
            </button>
            {chat.users.map((user) =>
              user.id !== session.user.id && user.image ? (
                <Image
                  key={user.id}
                  src={user.image}
                  alt={`${user.name} avatar`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : null
            )}
            <h3 className="text-lg font-semibold">
              {chat.users
                .filter((user) => user.id !== session.user.id)
                .map((user) => user.name)
                .join(', ')}
            </h3>
            <button
              onClick={handleClick}
              className="ml-auto rounded-full border-2 border-red-900 bg-red-400 px-3 py-1 text-white hover:bg-red-600"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto">
            {messages && messages.length ? (
              <ul
                id="messages-list"
                className="flex h-full w-full flex-col justify-end gap-2 border bg-cyan-100 p-1 pb-8"
              >
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={classNames('w-fit rounded-full border-2 px-4 py-1.5', {
                      'self-end border-black bg-white': message.senderId === session.user.id,
                      'border-cyan-900 bg-cyan-500 text-white':
                        message.senderId !== session.user.id,
                    })}
                  >
                    {message.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="my-auto font-light text-gray-500">{NO_MESSAGES_TEXT}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex min-h-[7%] border-t border-black p-1">
            <textarea
              name="message"
              placeholder="Write your message here..."
              value={messageContent}
              maxLength={150}
              onChange={handleChange}
              className="h-full w-full resize-none outline-none"
            />
            <button
              type="submit"
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

  const props: { session: Session } & {
    chat?: Nullable<ChatRelevant>;
  } = {
    session,
    chat: null,
  };
  try {
    const chat: ChatRelevant | undefined = await customKy
      .get(API_ENDPOINTS.chat.getChat(ctx.params?.id as string))
      .json();

    props.chat = chat;
  } catch (err) {
    logError('ChatPage (getServerSideProps)', err);
  }

  if (props.chat && !props.chat.users.find((user) => user.id === props.session.user.id)) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.chats,
      },
    };
  }

  return { props };
}) satisfies GetServerSideProps<{
  session: Session;
  chat?: Nullable<ChatRelevant>;
}>;
