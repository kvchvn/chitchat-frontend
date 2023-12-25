import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { useChatActionsSelector, useChatsSelector } from '~/store/selectors/chat-selectors';
import { ChatsRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { getUserChats } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { ChatsList } from '../../components/chats-page/chats-list';

type ServerSideProps = {
  session: Session;
  chats: Nullable<ChatsRecord>;
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
      {chatsFromProps ? <ChatsList chats={chats ?? chatsFromProps} /> : <p>Error</p>}
    </>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = {
    session,
    chats: null,
  };

  try {
    const chats = await getUserChats(session.user.id, req.cookies);

    props.chats = chats;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
