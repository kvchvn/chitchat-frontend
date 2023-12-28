import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { ServerErrorFallback } from '~/components/chats-page/server-error-fallback';
import { DEFAULT_ERROR_RESPONSE } from '~/constants/global';
import { useChatActionsSelector, useChatsSelector } from '~/store/selectors/chat-selectors';
import { ChatsRecord } from '~/types/chats';
import { BasicServerSideProps, Nullable } from '~/types/global';
import { isErrorResponse } from '~/types/guards';
import { getUserChats } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { ChatsList } from '../../components/chats-page/chats-list';

type ServerSideProps = BasicServerSideProps & {
  chats: Nullable<ChatsRecord>;
};

export default function ChatsPage({
  chats: chatsFromProps,
  error,
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
      <Head>
        <title>Chats | Chit-Chat</title>
      </Head>
      <h2 className="text-2xl font-semibold">Chats</h2>
      <ServerErrorFallback error={error}>
        {chatsFromProps && <ChatsList chats={chats ?? chatsFromProps} />}
      </ServerErrorFallback>
    </>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = { session, chats: null, error: null };

  try {
    const chats = await getUserChats(session.user.id, req.cookies);

    if (!chats) {
      throw new Error(
        `Failed to load user's chats (userId=${session.user.id}) in getServerSideProps on ChatsPage.`
      );
    }

    props.chats = chats;
  } catch (err) {
    logError('ChatsPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;
