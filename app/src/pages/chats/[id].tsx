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
import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ChatPage({
  session,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [messageContent, setMessageContent] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    messageId: Nullable<string>;
    isVisible: boolean;
    yCoordinate: number;
    xCoordinate: number;
  }>({
    messageId: null,
    isVisible: false,
    yCoordinate: 0,
    xCoordinate: 0,
  });

  const router = useRouter();

  const messages = useMessagesSelector();
  const { setMessages } = useChatActionsSelector();
  const socket = useSocketSelector();

  const contextMenuRef = useRef<Nullable<HTMLDivElement>>(null);
  const containerRef = useRef<Nullable<HTMLDivElement>>(null);
  const lowestElementRef = useRef<Nullable<HTMLLIElement>>(null);

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

  const handleClearChat = () => {
    if (socket && chat) {
      socket.emit('chat:clear', { chatId: chat.id });
    }
  };

  const handleContextMenu = ({ e, messageId }: { e: React.MouseEvent; messageId: string }) => {
    e.preventDefault();
    setContextMenu((prevState) => ({
      ...prevState,
      messageId,
      isVisible: !prevState.isVisible,
      yCoordinate: e.clientY,
      xCoordinate: e.clientX,
    }));
  };

  const handleRemoveMessage = () => {
    if (socket && chat && contextMenu.messageId) {
      socket.emit('message:remove', { chatId: chat.id, messageId: contextMenu.messageId });
    }
  };

  useLayoutEffect(() => {
    if (contextMenuRef.current && containerRef.current) {
      const DELTA = 10;
      const { width: contextMenuWidth, height: contextMenuHeight } =
        contextMenuRef.current.getBoundingClientRect();
      const {
        width: parentWidth,
        left: parentLeft,
        top: parentTop,
      } = containerRef.current.getBoundingClientRect();
      const left =
        parentLeft + parentWidth - contextMenu.xCoordinate > contextMenuWidth + DELTA
          ? contextMenu.xCoordinate
          : contextMenu.xCoordinate - contextMenuWidth;
      const top =
        contextMenu.yCoordinate - parentTop < contextMenuHeight + DELTA
          ? contextMenu.yCoordinate
          : contextMenu.yCoordinate - contextMenuHeight;
      contextMenuRef.current.style.left = `${left}px`;
      contextMenuRef.current.style.top = `${top}px`;
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        !contextMenuRef.current?.contains(target) ||
        (contextMenuRef.current.contains(target) && target.tagName === 'BUTTON')
      ) {
        setContextMenu((prevState) => ({ ...prevState, isVisible: false, top: 0, left: 0 }));
      }
    };

    if (contextMenu.isVisible) {
      document.body.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

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

  useEffect(() => {
    if (lowestElementRef.current && messages) {
      console.log('scroll down');
      lowestElementRef.current.scrollIntoView();
    }
  }, [messages]);

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
              onClick={handleClearChat}
              className="ml-auto rounded-full border-2 border-red-900 bg-red-400 px-3 py-1 text-white hover:bg-red-600"
            >
              Clear
            </button>
          </div>
          <div ref={containerRef} className="relative h-[85%] overflow-y-auto">
            {contextMenu.isVisible && (
              <div ref={contextMenuRef} className={`fixed z-10 border border-black bg-white py-2`}>
                <ul className="flex flex-col gap-1">
                  <li className="cursor-pointer px-4 py-1 hover:bg-gray-300">
                    <button onClick={handleRemoveMessage}>Remove</button>
                  </li>
                  <li className="cursor-pointer px-4 py-1 hover:bg-gray-300">
                    <button>Edit</button>
                  </li>
                </ul>
              </div>
            )}
            {messages && messages.length ? (
              <ul
                id="messages-list"
                className="flex w-full flex-col justify-end gap-2 border bg-cyan-100 p-1 pb-8"
              >
                {messages.map((message, index) => (
                  <li
                    key={index}
                    onContextMenu={(e) => handleContextMenu({ e, messageId: message.id })}
                    className={classNames(
                      'overflow-anywhere w-fit max-w-[45%] whitespace-pre-line rounded-md border-2 px-4 py-1.5',
                      {
                        'self-end border-black bg-white': message.senderId === session.user.id,
                        'border-cyan-900 bg-cyan-500 text-white':
                          message.senderId !== session.user.id,
                      }
                    )}
                  >
                    {message.content}
                  </li>
                ))}
                <li ref={lowestElementRef} />
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-light text-gray-500">{NO_MESSAGES_TEXT}</p>
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

  const props: {
    session: Session;
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
