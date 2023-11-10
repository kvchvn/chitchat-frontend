import { CustomSocket, Nullable } from '@/types';
import { Icon } from '@/ui/icon';
import classNames from 'classnames';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

type UserInfoProps = {
  session: Session;
  socket: Nullable<CustomSocket>;
  closeModal: () => void;
};

export function UserInfo({ session, socket, closeModal }: UserInfoProps) {
  const handleClick = () => {
    signOut();
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  if (!session.user.email || !session.user.name) {
    return;
  }

  return (
    <div className="absolute left-[200%] top-[-75%] z-20 border border-black bg-stone-200 py-4 pl-4 pr-8">
      <button
        onClick={handleCloseModal}
        className="absolute right-1 top-1 h-6 w-6 hover:bg-stone-400"
      >
        <Icon id="close-md" />
      </button>
      <h5 className="font-semibold">{session.user.name}</h5>
      <p>{session.user.email}</p>
      <p className="mt-2 flex items-center gap-1 text-sm">
        <span
          className={classNames('block h-3 w-3 rounded-full border border-black', {
            'bg-green-600': socket,
            'bg-red-700': !socket,
          })}
        />
        {socket ? 'Online' : 'Offline'}
      </p>
      <button onClick={handleClick} className="mt-4 font-semibold text-rose-500 hover:underline">
        Sign Out
      </button>
    </div>
  );
}
