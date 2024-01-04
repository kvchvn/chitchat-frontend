import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { ServerErrorFallback } from '~/components/chat-page/server-error-fallback';
import { DEFAULT_ERROR_RESPONSE, ROUTES } from '~/constants/global';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { BasicServerSideProps, Nullable } from '~/types/global';
import { isErrorResponse } from '~/types/guards';
import { getChat } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirect, gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { DisabledChatMessage } from '../../components/chat-page/disabled-chat-message';
import { EditedMessagePreview } from '../../components/chat-page/edited-message-preview';
import { Header } from '../../components/chat-page/header';
import { MainContent } from '../../components/chat-page/main-content';
import { MessageSendingForm } from '../../components/chat-page/message-sending-form';

type ServerSideProps = BasicServerSideProps & {
  chat: Nullable<ExtendedChatWithMessagesRecord>;
};

export default function ChatPage({
  session,
  chat,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('ChatPage RENDER');

  return (
    <>
      <Head>
        <title>{`Chat ${
          chat?.users[0].name ? `with ${chat.users[0].name}` : ''
        } | Chit-Chat`}</title>
      </Head>
      <ServerErrorFallback error={error}>
        {chat && (
          <section className="flex h-full flex-col">
            <Header chatId={chat.id} chatUsers={chat.users} />
            <MainContent chat={chat} userId={session.user.id} />
            <EditedMessagePreview />
            {chat.isDisabled ? (
              <DisabledChatMessage />
            ) : (
              <MessageSendingForm chatId={chat.id} userId={session.user.id} />
            )}
          </section>
        )}
      </ServerErrorFallback>
    </>
  );
}

export const getServerSideProps = (async ({ req, res, params }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = { session, chat: null, error: null };

  try {
    const chatId = typeof params?.id === 'string' ? params.id : '';
    const chat = await getChat({ chatId, cookies: req.cookies });

    if (!chat) {
      throw new Error(`Failed to load chat (chatId=${chatId}) in getServerSideProps on ChatPage.`);
    }

    const isSessionUserInChat = Boolean(chat?.users.find((user) => user.id === session.user.id));

    if (!isSessionUserInChat) {
      return gsspRedirect(ROUTES.chats);
    }

    props.chat = chat;
  } catch (err) {
    logError('ChatPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;
