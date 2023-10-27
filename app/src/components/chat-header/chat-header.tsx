import { DEFAULT_USERNAME } from '@/constants';
import { useSocketSelector } from '@/store';
import { UserRelevant } from '@/types';
import { Icon } from '@/ui/icon';
import { UserAvatar } from '@/ui/user-avatar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

type ChatHeaderProps = {
  chatId: string;
  chatUsers: UserRelevant[];
};

export function ChatHeader({ chatId, chatUsers }: ChatHeaderProps) {
  const router = useRouter();
  const socket = useSocketSelector();
  const { data: session } = useSession();
  const [friend] = useState(() =>
    session ? chatUsers.find((user) => user.id !== session.user.id) : undefined
  );

  const handleClearChat = () => {
    if (socket) {
      socket.emit('chat:clear', { chatId });
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <button
        onClick={router.back}
        className="hover: h-8 w-8 rounded-full border border-black p-1 hover:bg-slate-100"
      >
        <Icon id="return" />
      </button>
      <div className="relative h-8 w-8 rounded-full">
        <UserAvatar
          username={friend?.name ?? null}
          src={friend?.image ?? null}
          className="rounded-full border border-black"
        />
      </div>
      <h3 className="text-lg">{friend?.name ?? DEFAULT_USERNAME}</h3>
      <button
        onClick={handleClearChat}
        className="ml-auto h-8 w-8 rounded-full border border-red-900 bg-red-100 p-1 text-white hover:bg-red-200"
      >
        <Icon id="basket" />
      </button>
    </div>
  );
}
