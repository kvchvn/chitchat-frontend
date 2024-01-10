import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { UserAvatar } from '~/components/ui/user-avatar';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { UserInfoModal } from './user-info-modal';

export function UserInfo() {
  const { data: session } = useSession();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const socket = useSocketSelector();

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div onClick={openModal} className="relative mx-auto mt-3 h-8 w-8">
      <UserAvatar
        src={session?.user.image}
        username={session?.user.name}
        className="dark:border-primary-outline-light border-primary-outline-dark cursor-pointer rounded-full border"
      />
      <span
        className={classNames(
          'dark:border-primary-outline-light border-primary-outline-dark absolute bottom-0 right-0 block h-2 w-2 rounded-full border',
          {
            'bg-success-base-light dark:bg-success-base-dark': socket,
            'bg-error-base-light dark:bg-error-base-dark': !socket,
          }
        )}
      />
      {isOpenModal && <UserInfoModal closeModal={closeModal} />}
    </div>
  );
}
