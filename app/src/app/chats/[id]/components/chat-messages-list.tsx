'use client';

import { useEffect, useRef } from 'react';
import { NO_MESSAGES_TEXT } from '~/constants/chats';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { getDateWithMonthName } from '~/utils/date';
import { ChatMessage } from './chat-message';

type ChatMessagesListProps = {
  messages: ExtendedChatWithMessagesRecord['messages'];
};

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const lowestElementRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    if (lowestElementRef.current) {
      lowestElementRef.current.scrollIntoView();
    }
  });

  return messages ? (
    <>
      {Object.entries(messages).map(([date, messagesOfDate]) => (
        <div key={date} className="mt-auto flex flex-col gap-2">
          <p className="mx-auto w-fit rounded-xl bg-indigo-100 px-3 py-1 font-mono text-xs text-gray-600">
            {getDateWithMonthName(date)}
          </p>
          <ul className="flex flex-col gap-2">
            {messagesOfDate.map((messageOfDate) => (
              <ChatMessage key={messageOfDate.id} message={messageOfDate} />
            ))}
          </ul>
        </div>
      ))}
      <div ref={lowestElementRef} className="h-5 self-center bg-red-500" />
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="font-light text-stone-500">{NO_MESSAGES_TEXT}</p>
    </div>
  );
}
