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
      console.log('resetUnseenMessageCount');
      resetUnseenMessageCount(chatId);
    },
    [resetUnseenMessageCount]
  );

  const onChatClear = useCallback(
    ({ chatId }: ServerToClientListenersArgs['chat:clear']) => {
      console.log('clearChat');
      removeMessagesFromChat(chatId);
    },
    [removeMessagesFromChat]
  );

  const onMessageRemove = useCallback(
    ({ messageId }: ServerToClientListenersArgs['message:remove']) => {
      console.log('removeMessage');
      removeMessage(messageId);
    },
    [removeMessage]
  );

  const registerChatListeners = useCallback(
    (socket: CustomSocket) => {
      socket.on('message:create', onMessageCreate);
      socket.on('message:read', onMessageRead);
      socket.on('chat:clear', onChatClear);
      socket.on('message:remove', onMessageRemove);
    },
    [onMessageCreate, onMessageRead, onChatClear, onMessageRemove]
  );

  return { registerChatListeners };
};
