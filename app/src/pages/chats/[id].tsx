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
import { ChatHeader } from '../../components/chat-page/chat-header';
import { DisabledChatMessage } from '../../components/chat-page/disabled-chat-message';
import { EditedMessagePreview } from '../../components/chat-page/edited-message-preview';
import { MainContent } from '../../components/chat-page/main-content';
import { MessageSendingForm } from '../../components/chat-page/message-sending-form';

type ServerSideProps = BasicServerSideProps & {
  chat: Nullable<ExtendedChatWithMessagesRecord>;
  friendName: string;
};

export default function ChatPage({
  session,
  chat,
  friendName,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('ChatPage RENDER');

  return (
    <>
      <Head>
        <title>{`Chat ${friendName ? `with ${friendName}` : ''} | Chit-Chat`}</title>
      </Head>
      <ServerErrorFallback error={error}>
        {chat && (
          <section className="flex h-full flex-col">
            <ChatHeader chatId={chat.id} chatUsers={chat.users} />
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

  const props: ServerSideProps = { session, chat: null, error: null, friendName: '' };

  try {
    const chatId = typeof params?.id === 'string' ? params.id : '';
    const chat = await getChat({ chatId, cookies: req.cookies });

    if (!chat) {
      throw new Error(`Failed to load chat (chatId=${chatId}) in getServerSideProps on ChatPage.`);
    }

    const isSessionUserInChat = Boolean(chat?.users[session.user.id]);

    if (!isSessionUserInChat) {
      return gsspRedirect(ROUTES.chats);
    }

    const friendName = Object.entries(chat.users).find(
      ([userId]) => session.user.id !== userId
    )?.[1].name;

    props.chat = chat;
    props.friendName = friendName ?? '';
  } catch (err) {
    logError('ChatPage (getServerSideProps)', err);
    props.error = isErrorResponse(err) ? err : DEFAULT_ERROR_RESPONSE;
  }

  return { props };
}) satisfies GetServerSideProps<ServerSideProps>;
