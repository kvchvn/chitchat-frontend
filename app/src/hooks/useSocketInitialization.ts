import { useSocketActionsSelector, useSocketSelector } from '@/store';
import { CustomSocket, Nullable } from '@/types';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatListeners } from './useChatListeners';

export const useSocketInitialization = ({ session }: { session?: Nullable<Session> }) => {
  const socket = useSocketSelector();
  const { setSocket, resetSocket } = useSocketActionsSelector();
  const { registerChatListeners } = useChatListeners({ session });

  useEffect(() => {
    if (session && !socket) {
      const socketInstance: CustomSocket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
      socketInstance.auth = { userId: session.user.id };

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
  }, [session, socket, setSocket, resetSocket, registerChatListeners]);
};
