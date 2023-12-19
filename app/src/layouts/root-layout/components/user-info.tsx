import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { UserAvatar } from '~/ui/user-avatar';
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
    <div onClick={openModal} className="relative mx-auto h-10 w-10">
      <UserAvatar
        src={session?.user.image}
        username={session?.user.name}
        className="cursor-pointer rounded-full border-2 border-black"
      />
      <span
        className={classNames(
          'absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-black',
          {
            'bg-green-600': socket,
            'bg-red-700': !socket,
          }
        )}
      />
      {isOpenModal && <UserInfoModal closeModal={closeModal} />}
    </div>
  );
}
