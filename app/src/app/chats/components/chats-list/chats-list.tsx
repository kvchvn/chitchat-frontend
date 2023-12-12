'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useChatActionsSelector, useChatsSelector } from '~/store/selectors/chat-selectors';
import { ChatsRecord } from '~/types/chats';
import { Nullable } from '~/types/global';
import { ChatItem } from '../chat-item';

type ChatsListProps = {
  chatsFromProps: ChatsRecord;
  session: Nullable<Session>;
};

export function ChatsList({ chatsFromProps, session }: ChatsListProps) {
  const chatsFromStore = useChatsSelector();
  const { setChats, resetChats } = useChatActionsSelector();

  useEffect(() => {
    if (chatsFromProps) {
      console.log('setChats');
      setChats(chatsFromProps);
    }

    return () => {
      resetChats();
    };
  }, [chatsFromProps, setChats, resetChats]);

  return (
    <SessionProvider session={session}>
      <ul className="mt-3">
        {Object.keys(chatsFromStore ?? chatsFromProps).length ? (
          Object.entries(chatsFromStore ?? chatsFromProps).map(([id, chat]) => (
            <ChatItem key={id} id={id} chat={chat} />
          ))
        ) : (
          <p>You have no chats</p>
        )}
      </ul>
    </SessionProvider>
  );
}
