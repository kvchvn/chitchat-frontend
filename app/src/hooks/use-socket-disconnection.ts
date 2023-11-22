import { useSocketSelector } from '@/store/selectors/socket-selectors';
import { useEffect } from 'react';

export const useSocketDisconnection = () => {
  const socket = useSocketSelector();

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);
};
