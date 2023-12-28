import { useEffect } from 'react';
import { useSocketSelector } from '~/store/selectors/socket-selectors';

export const useSocketDisconnection = () => {
  const socket = useSocketSelector();

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);
};
