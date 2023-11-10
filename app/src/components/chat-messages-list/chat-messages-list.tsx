import { NO_MESSAGES_TEXT } from '@/constants';
import { ChatRelevant, Nullable } from '@/types';
import { getDateWithMonthName } from '@/utils';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';

type ChatMessagesListProps = {
  messages: ChatRelevant['messages'];
};

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const { data: session } = useSession();

  const lowestElementRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    if (lowestElementRef.current && messages) {
      lowestElementRef.current.scrollIntoView();
    }
  }, [messages]);

  if (!session) {
    return null;
  }

  return messages ? (
    <>
      {Object.entries(messages).map(([date, messagesOfDate]) =>
        messagesOfDate.length ? (
          <div key={date} className="flex flex-col gap-2">
            <p className="mx-auto w-fit rounded-xl bg-indigo-100 px-3 py-1 font-mono text-xs text-gray-600">
              {getDateWithMonthName(date)}
            </p>
            <ul className="flex flex-col gap-2">
              {messagesOfDate.map((messageOfDate) => (
                <ChatMessage key={messageOfDate.id} message={messageOfDate} />
              ))}
            </ul>
          </div>
        ) : null
      )}
      <div ref={lowestElementRef} />
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="font-light text-stone-500">{NO_MESSAGES_TEXT}</p>
    </div>
  );
}
