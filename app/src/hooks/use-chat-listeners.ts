import { useCallback } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import { useMessageActionsSelector } from '~/store/selectors/message-selectors';
import { CustomSocket, ServerToClientListenersArgs } from '~/types/socket';

export const useChatListeners = () => {
  const { resetUnreadMessageCount: resetUnreadMessageCount, clearChat } = useChatActionsSelector();
  const { setMessages, readMessages } = useMessageActionsSelector();

  const onReadChat = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:read']) => {
      resetUnreadMessageCount(chatId);
      readMessages();
    },
    [resetUnreadMessageCount, readMessages]
  );

  const onClearChat = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:clear']) => {
      clearChat(chatId);
      setMessages({});
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
