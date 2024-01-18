import { ChatsRecord } from '~/types/chats';
import { ChatItem } from './chat-item';

type ChatsListProps = {
  chats: ChatsRecord;
};

export function ChatsList({ chats }: ChatsListProps) {
  return (
    <ul>
      {Object.keys(chats).length ? (
        Object.entries(chats).map(([id, chat]) => <ChatItem key={id} id={id} chat={chat} />)
      ) : (
        <p>You have no chats</p>
      )}
    </ul>
  );
}
