import { getSessionData } from '~/auth';
import { getUserChats } from '~/utils/api';
import { ChatsList } from './components/chats-list';

export default async function ChatsPage() {
  const session = await getSessionData();
  const chats = await getUserChats(session?.user.id);

  return (
    <>
      <h1 className="text-2xl font-semibold">Chats</h1>
      {chats && <ChatsList chatsFromProps={chats} session={session} />}
    </>
  );
}
