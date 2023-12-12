import { getSessionData } from '~/auth';
import { DEFAULT_USER } from '~/constants/chats';
import { UserAvatar } from '~/ui/user-avatar';
import { getChat } from '~/utils/api';
import { ClearChatButton } from './clear-chat-button';
import { GoBackButton } from './go-back-button';

type ChatHeaderProps = {
  chatId: string;
};

export async function ChatHeader({ chatId }: ChatHeaderProps) {
  const session = await getSessionData();
  const chat = await getChat(chatId);

  if (!chat || !session) {
    return null;
  }

  const friend = chat.users.filter((user) => user.id !== session.user.id)[0];

  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <GoBackButton />
      <div className="relative h-8 w-8 rounded-full">
        <UserAvatar
          username={friend.name}
          src={friend.image}
          className="rounded-full border border-black"
        />
      </div>
      <h3 className="text-lg">{friend.name ?? DEFAULT_USER.name}</h3>
      <ClearChatButton chatId={chatId} />
    </div>
  );
}
