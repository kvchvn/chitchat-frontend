'use client';

import classNames from 'classnames';
import { AdapterUser } from 'next-auth/adapters';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { UserAvatar } from '~/ui/user-avatar';
import { UserInfoModal } from './user-info-modal';

type UserInfoModalProps = {
  user: AdapterUser;
};

export function UserInfoSidebarItem({ user }: UserInfoModalProps) {
  const [isShowModal, setIsShowModal] = useState(false);
  const socket = useSocketSelector();
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsShowModal(true);
  };

  const closeModal = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowModal(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!modalRef.current?.contains(target)) {
        setIsShowModal(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);
    document.body.addEventListener('contextmenu', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
      document.body.removeEventListener('contextmenu', handleClickOutside);
    };
  }, []);

  return (
    <div onClick={openModal} className="relative mx-auto h-10 w-10">
      <UserAvatar
        src={user.image}
        username={user.name}
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

      {isShowModal && <UserInfoModal ref={modalRef} closeModal={closeModal} user={user} />}
    </div>
  );
}
