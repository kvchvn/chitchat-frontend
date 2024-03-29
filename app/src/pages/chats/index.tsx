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
import { extractUnreadChatsIdsFromRecord } from '~/utils/extract-unread-chats-ids-from-record';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { ChatsList } from '../../components/chats-page/chats-list';

type ServerSideProps = BasicServerSideProps & {
  chats: Nullable<ChatsRecord>;
};

export default function ChatsPage({
  chats: chatsFromProps,
  session,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const chats = useChatsSelector();
  const { setChats, resetChats, setUnreadChatsIds, resetUnreadChatsIds } = useChatActionsSelector();

  console.log('ChatsPage RENDER', chats);
  useEffect(() => {
    if (chatsFromProps) {
      setChats(chatsFromProps);

      const unreadChatsIds = extractUnreadChatsIdsFromRecord({
        chats: chatsFromProps,
        sessionUserId: session.user.id,
      });
      setUnreadChatsIds(unreadChatsIds);
    }

    return () => {
      resetChats();
    };
  }, [
    chatsFromProps,
    setChats,
    resetChats,
    setUnreadChatsIds,
    resetUnreadChatsIds,
    session.user.id,
  ]);

  return (
    <>
      <Head>
        <title>Chats | Chit-Chat</title>
      </Head>
      <h1 className="title">Your chats</h1>
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
    const chats = await getUserChats({ userId: session.user.id, cookies: req.cookies });

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
