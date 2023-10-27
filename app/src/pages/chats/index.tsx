import { ChatsList } from '@/components/chats-list';
import { API_ENDPOINTS, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { useChatActionsSelector, useChatsSelector } from '@/store';
import { ChatsRecord, Nullable } from '@/types';
import { logError } from '@/utils';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import { useEffect } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

type ServerSidePropsType = {
  session: Session;
  chats: Nullable<ChatsRecord>;
};

export default function ChatsPage({
  chats: chatsFromProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const chats = useChatsSelector();
  const { setChats } = useChatActionsSelector();

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
      <h2 className="text-2xl font-semibold">Chats</h2>
      {chatsFromProps ? chats ? <ChatsList chats={chats} /> : <p>Loading...</p> : <p>Error</p>}
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

  const props: ServerSidePropsType = {
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
}) satisfies GetServerSideProps;
