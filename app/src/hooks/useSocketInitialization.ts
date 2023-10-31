import { useSocketActionsSelector } from '@/store';
import { CustomSocket, Nullable } from '@/types';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatListeners } from './useChatListeners';

export const useSocketInitialization = ({ session }: { session?: Nullable<Session> }) => {
  const { setSocket, resetSocket } = useSocketActionsSelector();
  const { registerChatListeners } = useChatListeners({ userId: session?.user.id });

  useEffect(() => {
    if (session?.user.id) {
      console.log('useSocketInitialization');
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
  }, [setSocket, resetSocket, session?.user.id, registerChatListeners]);
};
