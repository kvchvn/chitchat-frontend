import { io } from 'socket.io-client';
import { CustomSocket } from '~/types/socket';

type SocketConnectionOptions = {
  userId?: string;
};

export const establishConnectionWithSocket = (options: SocketConnectionOptions) => {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!SERVER_URL || !options.userId) return;

  // the socket automatically connects
  const socket: CustomSocket = io(SERVER_URL);
  socket.auth = { userId: options.userId };

  return socket;
};
