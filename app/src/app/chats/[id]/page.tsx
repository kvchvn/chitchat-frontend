import { getSessionData } from '~/auth';
import { getChat } from '~/utils/api';
import { ChatHeader } from './components/chat-header';
import { ChatMainContent } from './components/chat-main-content';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getSessionData();
  const chat = await getChat(params.id);

  return (
    <section className="flex h-full flex-col">
      <ChatHeader chatId={params.id} />
      {chat && <ChatMainContent chat={chat} session={session} />}
    </section>
  );
}
