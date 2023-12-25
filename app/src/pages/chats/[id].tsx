import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import { ROUTES } from '~/constants/global';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { getChat } from '~/utils/api';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirect, gsspRedirectToSignIn } from '~/utils/gssp-redirect';
import { logError } from '~/utils/log-error';
import { DisabledChatMessage } from '../../components/chat-page/disabled-chat-message';
import { EditedMessagePreview } from '../../components/chat-page/edited-message-preview';
import { Header } from '../../components/chat-page/header';
import { MainContent } from '../../components/chat-page/main-content';
import { MessageSendingForm } from '../../components/chat-page/message-sending-form';

type ServerSideProps = {
  session: Session;
  chat: Nullable<ExtendedChatWithMessagesRecord>;
};

export default function ChatPage({
  session,
  chat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log('ChatPage RENDER');

  return (
    <>
      {!chat ? (
        <p>Error</p>
      ) : (
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
    </>
  );
}

export const getServerSideProps = (async ({ req, res, params }) => {
  const session = await getSessionData(req, res);

  if (!session) {
    return gsspRedirectToSignIn();
  }

  const props: ServerSideProps = {
    session,
    chat: null,
  };

  const chatId = typeof params?.id === 'string' ? params.id : '';

  try {
    const chat = await getChat(chatId, req.cookies);

    const isSessionUserInChat = Boolean(chat?.users.find((user) => user.id === session.user.id));

    if (!isSessionUserInChat) {
      gsspRedirect(ROUTES.chats);
    }

    props.chat = chat;
  } catch (err) {
    logError('ChatPage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
