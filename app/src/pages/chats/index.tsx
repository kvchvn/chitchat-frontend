import { API_ENDPOINTS, NO_MESSAGES_TEXT, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { logError } from '@/lib';
import { useChatActionsSelector, useChatsSelector } from '@/store';
import { ChatsRecord, Nullable } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

export default function HomePage({
  session,
  chats: chatsFromProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const chats = useChatsSelector();
  const { setChats } = useChatActionsSelector();

  const handleClick = (id: string) => {
    router.push(ROUTES.chat(id));
  };

  useEffect(() => {
    if (chatsFromProps) {
      setChats(chatsFromProps);
    }

    return () => {
      setChats(null);
    };
  }, [chatsFromProps, setChats]);

  return (
    <>
      <h2 className="text-2xl font-semibold">Home Page</h2>
      {!chats ? (
        <p>Fetching error</p>
      ) : (
        <ul className="mt-3">
          {Object.entries(chats).map(([id, { lastMessage, unseenMessagesCount, users }]) => (
            <li
              key={id}
              onClick={() => handleClick(id)}
              className="h-22 flex gap-3 border-y p-2 hover:cursor-pointer"
            >
              <div>
                {users.map((user) =>
                  user.image ? (
                    <Image
                      key={user.id}
                      src={user.image}
                      width={56}
                      height={56}
                      alt="User's avatar"
                      className="shrink-0 rounded-full p-2"
                    />
                  ) : null
                )}
              </div>
              <div className="flex h-full flex-col">
                <p>{users.map((user) => user.name).join(', ')}</p>
                <p className="text-sm text-gray-500">
                  {lastMessage ? lastMessage.content : NO_MESSAGES_TEXT}
                </p>
              </div>
              {unseenMessagesCount && lastMessage && lastMessage.senderId !== session.user.id ? (
                <span className="my-auto ml-auto h-9 w-9 rounded-full bg-blue-400 text-center leading-9 text-white">
                  {unseenMessagesCount <= 9 ? unseenMessagesCount : '9+'}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
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

  const props: { session: Session } & { chats: Nullable<ChatsRecord> } = {
    session,
    chats: null,
  };

  try {
    const chats: ChatsRecord = await customKy
      .get(API_ENDPOINTS.user.getChatsOf(session.user.id))
      .json();

    props.chats = chats;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps<{ session: Session }>;
