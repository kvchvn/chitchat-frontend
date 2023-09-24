import { useSocketActionsSelector, useSocketSelector } from '@/store';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useSocketInitialization = () => {
  const socket = useSocketSelector();
  const { connectToSocket, disconnectFromSocket } = useSocketActionsSelector();

  useEffect(() => {
    if (!socket) {
      const socketClient = io(process.env.NEXT_PUBLIC_SERVER_URL as string);

      socketClient.on('connect', () => {
        connectToSocket(socketClient);
      });
      socketClient.on('disconnect', disconnectFromSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, connectToSocket, disconnectFromSocket]);
};
