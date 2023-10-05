import { CustomSocket } from '@/types';

export const registerChatListeners = (socket: CustomSocket) => {
  socket.on('message:create', ({ content }) => {
    console.log('From Server: ', content);
  });
};
