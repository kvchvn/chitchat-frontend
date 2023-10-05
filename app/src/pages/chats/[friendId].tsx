import { API_ENDPOINTS, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { logError } from '@/lib';
import { useSocketSelector } from '@/store';
import { ChatWithMessages, Nullable, UserRelevant } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ChatPage({
  session,
  friend,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const socket = useSocketSelector();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!chat || !friend) {
        throw new Error('There are no chat or/and friend.');
      }
      if (!socket) {
        throw new Error('Socket is not connected.');
      }

      socket.emit('message:create', {
        chatId: chat.id,
        senderId: session.user.id,
        content: message,
      });
    } catch (err) {
      logError('Chat Page (handleSubmit): ', err);
    }
    setMessage('');
  };

  return (
    <>
      {!friend || !chat ? (
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
            {friend.image && (
              <Image
                src={friend.image}
                alt={`${friend.name} avatar`}
                width={30}
                height={30}
                className="rounded-full"
              />
            )}
            <h3 className="text-lg font-semibold">{friend.name}</h3>
          </div>
          <div className="flex h-full items-center justify-center">
            {chat.messages.length ? (
              <ul></ul>
            ) : (
              <p className="my-auto font-light text-gray-500">There are no messages yet</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex h-auto border-t border-black p-1">
            <textarea
              name="message"
              placeholder="Write your message here..."
              value={message}
              maxLength={150}
              onChange={handleChange}
              className="h-full w-full resize-none outline-none"
            />
            <button
              type="submit"
              disabled={!message}
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
    friend: Nullable<UserRelevant>;
    chat?: Nullable<ChatWithMessages>;
  } = {
    session,
    friend: null,
    chat: null,
  };
  try {
    const friend: UserRelevant = await customKy
      .get(API_ENDPOINTS.user.getById(ctx.query.friendId as string))
      .json();

    const chat: ChatWithMessages | undefined = await customKy
      .get(API_ENDPOINTS.chat.getChatBetween({ userId: session.user.id, friendId: friend.id }))
      .json();

    props.friend = friend;
    props.chat = chat;
  } catch (err) {
    logError('ChatPage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps<{
  session: Session;
  friend: Nullable<UserRelevant>;
  chat?: Nullable<ChatWithMessages>;
}>;
