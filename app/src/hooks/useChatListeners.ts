import { useChatActionsSelector } from '@/store';
import { CustomSocket, Nullable, ServerToClientListenersArgs } from '@/types';
import { logError } from '@/utils';
import { Session } from 'next-auth';
import { useCallback } from 'react';

export const useChatListeners = ({ session }: { session?: Nullable<Session> }) => {
  const {
    pushMessage,
    incrementUnseenMessagesCount,
    resetUnseenMessageCount,
    removeMessagesFromChat,
    removeMessage,
    editMessage,
  } = useChatActionsSelector();

  const onMessageCreate = useCallback(
    (message: ServerToClientListenersArgs['message:create']) => {
      if (message && session) {
        pushMessage(message);
        if (message.senderId !== session.user.id) {
          incrementUnseenMessagesCount({
            chatId: message.chatId,
            newLastMessage: { content: message.content, senderId: message.senderId },
          });
        }
      } else {
        logError('Chat Listeners (message:create)', 'Message sending error occurred.');
      }
    },
    [session, incrementUnseenMessagesCount, pushMessage]
  );

  const onMessageRead = useCallback(
    ({ chatId }: ServerToClientListenersArgs['message:read']) => {
      resetUnseenMessageCount(chatId);
    },
    [resetUnseenMessageCount]
  );

  const onChatClear = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:clear']) => {
      removeMessagesFromChat(chatId);
    },
    [removeMessagesFromChat]
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
