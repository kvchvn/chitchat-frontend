import { ChatsList } from '@/components/chats-list';
import { ROUTES } from '@/constants/global';
import { customKy } from '@/ky';
import { useChatActionsSelector, useChatsSelector } from '@/store/selectors/chat-selectors';
import { UserChatsResponse } from '@/types/api';
import { logError } from '@/utils/log-error';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import { useEffect } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';

type ServerSidePropsType = {
  session: Session;
  chats: UserChatsResponse['data'];
};

export default function ChatsPage({
  chats: chatsFromProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const chats = useChatsSelector();
  const { setChats, resetChats } = useChatActionsSelector();
  console.log('ChatsPage RENDER', chats);
  useEffect(() => {
    if (chatsFromProps) {
      setChats(chatsFromProps);
    }

    return () => {
      resetChats;
    };
  }, [chatsFromProps, setChats, resetChats]);

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
    const chats = await customKy.get(`users/${session.user.id}/chats`).json<UserChatsResponse>();

    props.chats = chats.data;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
