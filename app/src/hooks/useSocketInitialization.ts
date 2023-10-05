import { registerChatListeners } from '@/listeners';
import { useSocketActionsSelector, useSocketSelector } from '@/store';
import { CustomSocket } from '@/types';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useSocketInitialization = ({ userId }: { userId: string | undefined }) => {
  const socket = useSocketSelector();
  const { setSocket, resetSocket } = useSocketActionsSelector();

  useEffect(() => {
    if (userId && !socket) {
      const socketInstance: CustomSocket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
      socketInstance.auth = { userId };

      socketInstance.on('connect', () => {
        setSocket(socketInstance);
      });

      socketInstance.on('disconnect', () => {
        resetSocket();
      });

      registerChatListeners(socketInstance);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, socket, setSocket, resetSocket]);
};
