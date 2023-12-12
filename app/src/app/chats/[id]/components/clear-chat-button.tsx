'use client';

import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { Icon } from '~/ui/icon';

type ClearChatButtonProps = {
  chatId: string;
};

export function ClearChatButton({ chatId }: ClearChatButtonProps) {
  const socket = useSocketSelector();

  const handleClick = () => {
    if (socket) {
      socket.emit('chat:clear', { chatId });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-auto h-8 w-8 rounded-full border border-red-900 bg-red-100 p-1 text-white hover:bg-red-200"
    >
      <Icon id="basket" />
    </button>
  );
}
