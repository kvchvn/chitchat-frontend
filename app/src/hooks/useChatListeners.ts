import { useChatActionsSelector, useMessageActionsSelector } from '@/store';
import { CustomSocket, ServerToClientListenersArgs } from '@/types';
import { useCallback } from 'react';

export const useChatListeners = () => {
  const { resetUnreadMessageCount: resetUnreadMessageCount, clearChat } = useChatActionsSelector();
  const { setMessages } = useMessageActionsSelector();

  const onReadChat = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:read']) => {
      resetUnreadMessageCount(chatId);
    },
    [resetUnreadMessageCount]
  );

  const onClearChat = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:clear']) => {
      clearChat(chatId);
      setMessages([]);
    },
    [clearChat, setMessages]
  );

  const registerListeners = useCallback(
    (socket: CustomSocket) => {
      socket.on('chat:read', onReadChat);
      socket.on('chat:clear', onClearChat);
    },
    [onReadChat, onClearChat]
  );

  return { registerListeners };
};
