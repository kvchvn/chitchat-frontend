import classNames from 'classnames';
import { AdapterUser } from 'next-auth/adapters';
import { signOut } from 'next-auth/react';
import React, { forwardRef } from 'react';
import { DEFAULT_USER } from '~/constants/chats';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { Icon } from '~/ui/icon';

type UserInfoModalProps = {
  user: AdapterUser;
  closeModal: (e: React.MouseEvent) => void;
};

export const UserInfoModal = forwardRef<HTMLDivElement, UserInfoModalProps>(function UserInfoModal(
  { user, closeModal },
  ref
) {
  const socket = useSocketSelector();

  const handleClick = () => {
    signOut();
  };

  return (
    <div
      ref={ref}
      className="absolute left-[200%] top-[-75%] z-20 border border-black bg-stone-200 py-4 pl-4 pr-8"
    >
      <button onClick={closeModal} className="absolute right-1 top-1 h-6 w-6 hover:bg-stone-400">
        <Icon id="close-md" />
      </button>
      <h5 className="font-semibold">{user.name ?? DEFAULT_USER.name}</h5>
      <p>{user.email ?? DEFAULT_USER.email}</p>
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
});
