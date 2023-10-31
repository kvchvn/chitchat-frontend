import { useChatActionsSelector } from '@/store';
import { CustomSocket, ServerToClientListenersArgs } from '@/types';
import { logError } from '@/utils';
import { useCallback } from 'react';

export const useChatListeners = ({ userId }: { userId?: string }) => {
  const {
    pushMessage,
    incrementUnseenMessagesCount,
    resetUnseenMessageCount,
    clearChat,
    removeMessage,
    editMessage,
  } = useChatActionsSelector();

  const onMessageCreate = useCallback(
    (message: ServerToClientListenersArgs['message:create']) => {
      if (message && userId) {
        pushMessage(message);
        if (message.senderId !== userId) {
          incrementUnseenMessagesCount({
            chatId: message.chatId,
            newLastMessage: { content: message.content, senderId: message.senderId },
          });
        }
      } else {
        logError('Chat Listeners (message:create)', 'Message sending error occurred.');
      }
    },
    [incrementUnseenMessagesCount, pushMessage, userId]
  );

  const onMessageRead = useCallback(
    ({ chatId }: ServerToClientListenersArgs['message:read']) => {
      resetUnseenMessageCount(chatId);
    },
    [resetUnseenMessageCount]
  );

  const onChatClear = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:clear']) => {
      clearChat(chatId);
    },
    [clearChat]
  );

  const onMessageRemove = useCallback(
    ({ messageId }: ServerToClientListenersArgs['message:remove']) => {
      removeMessage(messageId);
    },
    [removeMessage]
  );

  const onMessageEdit = useCallback(
    ({ messageId, content }: ServerToClientListenersArgs['message:edit']) => {
      editMessage({ messageId, content });
    },
    [editMessage]
  );

  const registerChatListeners = useCallback(
    (socket: CustomSocket) => {
      socket.on('message:create', onMessageCreate);
      socket.on('message:read', onMessageRead);
      socket.on('chat:clear', onChatClear);
      socket.on('message:remove', onMessageRemove);
      socket.on('message:edit', onMessageEdit);
    },
    [onMessageCreate, onMessageRead, onChatClear, onMessageRemove, onMessageEdit]
  );

  return { registerChatListeners };
};
