import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { NO_MESSAGES_TEXT } from '~/constants/chats';
import { ExtendedChatWithMessagesRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { getDateWithMonthName } from '~/utils/date';
import { ChatMessage } from './message';

type MessagesListProps = {
  messages: ExtendedChatWithMessagesRecord['messages'];
  users: ExtendedChatWithMessagesRecord['users'];
};

export function MessagesList({ messages, users }: MessagesListProps) {
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

  return Object.keys(messages).length ? (
    <>
      {Object.entries(messages).map(([date, messagesOfDate]) =>
        messagesOfDate.length ? (
          <div key={date} className="mt-auto flex flex-col gap-2">
            <p className="mx-auto w-fit rounded-xl bg-indigo-100 px-3 py-1 font-mono text-xs text-gray-600">
              {getDateWithMonthName(date)}
            </p>
            <ul className="flex flex-col gap-2">
              {messagesOfDate.map((messageOfDate, index) => (
                <ChatMessage
                  key={messageOfDate.id}
                  message={messageOfDate}
                  isFirstMessageBySender={Boolean(
                    messagesOfDate[index].senderId !== messagesOfDate[index - 1]?.senderId
                  )}
                  isLastMessageBySender={Boolean(
                    messagesOfDate[index].senderId !== messagesOfDate[index + 1]?.senderId
                  )}
                  sender={users[messageOfDate.senderId]}
                />
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
