import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSocketActionsSelector } from '~/store/selectors/socket-selectors';
import { CustomSocket } from '~/types/socket';
import { useChatListeners } from './use-chat-listeners';
import { useMessageListeners } from './use-message-listeners';

export const useSocketInitialization = ({
  userId,
  sessionToken,
}: {
  userId?: string;
  sessionToken?: string;
}) => {
  const { setSocket, resetSocket } = useSocketActionsSelector();
  const { registerListeners: registerChatListeners } = useChatListeners();
  const { registerListeners: registerMessageListeners } = useMessageListeners({
    userId,
  });

  useEffect(() => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!userId || !SERVER_URL || !sessionToken) return;

    console.log('useSocketInitialization');
    const socketInstance: CustomSocket = io(SERVER_URL, { autoConnect: false });
    socketInstance.auth = { userId, sessionToken };
    socketInstance.connect();

    socketInstance.on('connect', () => {
      console.log('socket is connected');
      setSocket(socketInstance);

      registerChatListeners(socketInstance);
      registerMessageListeners(socketInstance);
    });

    socketInstance.on('disconnect', () => {
      resetSocket();
    });

    socketInstance.on('error', (err) => {
      console.log('Server Error (Socket): ', err.message);
    });

    return () => {
      resetSocket();
      socketInstance.disconnect();
    };
  }, [
    setSocket,
    resetSocket,
    userId,
    registerChatListeners,
    registerMessageListeners,
    sessionToken,
  ]);
};
