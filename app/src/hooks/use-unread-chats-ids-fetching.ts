import { useEffect } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import { getUserUnreadChatsIds } from '~/utils/api';
import { logError } from '~/utils/log-error';

export const useUnreadChatsIdsFetching = ({ userId }: { userId?: string }) => {
  const { setChats, setUnreadChatsIds, resetChats } = useChatActionsSelector();

  console.log('App render');

  useEffect(() => {
    if (!userId) return;

    getUserUnreadChatsIds({ userId })
      .then((unreadChats) => {
        if (unreadChats) {
          setUnreadChatsIds(unreadChats.ids);
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
