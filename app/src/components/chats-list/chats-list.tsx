import { ChatsRecord } from '@/types';
import { ChatItem } from '../chat-item';

type ChatsListProps = {
  chats: ChatsRecord;
};

export function ChatsList({ chats }: ChatsListProps) {
  return (
    <ul className="mt-3">
      {Object.entries(chats).map(([id, chat]) => (
        <ChatItem key={id} id={id} chat={chat} />
      ))}
    </ul>
  );
}
