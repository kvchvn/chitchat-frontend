import { useEffect } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import { getUserChats } from '~/utils/api';
import { getUnreadChatsIds } from '~/utils/get-unread-chats-ids';
import { logError } from '~/utils/log-error';

export const useUserChatsFetching = ({ userId }: { userId?: string }) => {
  const { setChats, setUnreadChatsIds, resetChats } = useChatActionsSelector();

  console.log('App render');

  useEffect(() => {
    if (!userId) return;

    getUserChats({ userId, cookies: {} })
      .then((chats) => {
        if (chats) {
          setChats(chats);

          const unreadChatsIds = getUnreadChatsIds({ chats, sessionUserId: userId });
          setUnreadChatsIds(unreadChatsIds);
        }
      })
      .catch((err) => {
        logError('useUserChatsFetching (useEffect)', err);
      });

    return () => {
      resetChats();
    };
  }, [userId, setChats, resetChats, setUnreadChatsIds]);
};
