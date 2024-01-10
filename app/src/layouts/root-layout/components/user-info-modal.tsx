import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { DEFAULT_USER } from '~/constants/chats';
import { useSocketSelector } from '~/store/selectors/socket-selectors';

type UserInfoModalProps = {
  closeModal: () => void;
};

export function UserInfoModal({ closeModal }: UserInfoModalProps) {
  const { data: session } = useSession();
  const socket = useSocketSelector();

  const handleClick = () => {
    signOut();
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <div className="border-primary-outline-dark dark:border-primary-outline-light dark:bg-primary-bg-darker bg-primary-bg-lighter dark:text-primary-bg-lightest absolute left-[150%] top-[-75%] z-20 border py-4 pl-4 pr-8">
      <button
        onClick={handleCloseModal}
        className="hover:bg-primary-bg-light dark:hover:bg-primary-bg-darkest absolute right-1 top-1 h-6 w-6"
      >
        <Icon id="close" />
      </button>
      <h5 className="font-semibold">{session?.user.name ?? DEFAULT_USER.name}</h5>
      <p className="font-light tracking-wide">{session?.user.email ?? DEFAULT_USER.email}</p>
      <p className="mt-2 flex items-center gap-1 font-mono text-sm">
        <span
          className={classNames(
            'border-primary-outline-dark dark:border-primary-outline-light block h-3 w-3 rounded-full border',
            {
              'bg-success-base-light dark:bg-success-base-dark': socket,
              'bg-error-base-light dark:bg-error-base-dark': !socket,
            }
          )}
        />
        {socket ? 'Online' : 'Offline'}
      </p>
      <Button size="sm" variant="destructive" onClick={handleClick} className="mt-4">
        <span className="relative mr-2 h-6 w-6">
          <Icon id="sign-out" className="fill-primary-bg-lightest" />
        </span>
        Sign Out
      </Button>
    </div>
  );
}
