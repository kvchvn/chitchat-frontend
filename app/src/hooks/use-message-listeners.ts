import { useCallback } from 'react';
import { useChatActionsSelector } from '~/store/selectors/chat-selectors';
import { useMessageActionsSelector } from '~/store/selectors/message-selectors';
import { CustomSocket, ServerToClientListenersArgs } from '~/types/socket';
import { logError } from '~/utils/log-error';

export const useMessageListeners = ({ userId }: { userId?: string }) => {
  const { incrementUnreadMessagesCount: incrementUnreadMessagesCount } = useChatActionsSelector();
  const { createMessage, removeMessage, editMessage, reactToMessage } = useMessageActionsSelector();

  const onCreateMessage = useCallback(
    (message: ServerToClientListenersArgs['message:create']) => {
      if (message && userId) {
        createMessage(message);
        if (message.senderId !== userId) {
          incrementUnreadMessagesCount({
            chatId: message.chatId,
            newLastMessage: {
              content: message.content,
              senderId: message.senderId,
              createdAt: message.createdAt,
            },
          });
        }
      } else {
        logError('Chat Listeners (message:create)', 'Message sending error occurred.');
      }
    },
    [incrementUnreadMessagesCount, createMessage, userId]
  );

  const onRemoveMessage = useCallback(
    ({ messageId }: ServerToClientListenersArgs['message:remove']) => {
      removeMessage(messageId);
    },
    [removeMessage]
  );

  const onEditMessage = useCallback(
    ({ messageId, content }: ServerToClientListenersArgs['message:edit']) => {
      editMessage({ messageId, content });
    },
    [editMessage]
  );

  const onReactToMessage = useCallback(
    ({ messageId, reactions }: ServerToClientListenersArgs['message:react']) => {
      reactToMessage({ messageId, reactions });
    },
    [reactToMessage]
  );

  const registerListeners = useCallback(
    (socket: CustomSocket) => {
      socket.on('message:create', onCreateMessage);
      socket.on('message:edit', onEditMessage);
      socket.on('message:remove', onRemoveMessage);
      socket.on('message:react', onReactToMessage);
    },
    [onCreateMessage, onEditMessage, onRemoveMessage, onReactToMessage]
  );

  return { registerListeners };
};
