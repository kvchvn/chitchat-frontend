import { ChatRelevant, Nullable } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';

type ChatMessagesListProps = {
  messages: ChatRelevant['messages'];
};

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const { data: session } = useSession();

  const lowestElementRef = useRef<Nullable<HTMLLIElement>>(null);

  useEffect(() => {
    if (lowestElementRef.current && messages) {
      lowestElementRef.current.scrollIntoView();
    }
  }, [messages]);

  if (!session) {
    return null;
  }

  return (
    <ul id="messages-list" className="flex min-h-full w-full flex-col justify-end gap-2">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <li ref={lowestElementRef} />
    </ul>
  );
}
