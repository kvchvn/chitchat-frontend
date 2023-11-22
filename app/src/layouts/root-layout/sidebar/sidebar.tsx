import { ROUTES } from '@/constants/global';
import { Nullable } from '@/types/global';
import { CustomSocket } from '@/types/socket';
import { Icon } from '@/ui/icon';
import { UserAvatar } from '@/ui/user-avatar';
import classNames from 'classnames';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SidebarItem } from './sidebar-item';
import { UserInfo } from './user-info';

type SidebarProps = {
  socket: Nullable<CustomSocket>;
  session?: Nullable<Session>;
};

export function Sidebar({ session, socket }: SidebarProps) {
  const [isShowUserInfo, setIsShowUserInfo] = useState(false);
  const pathname = usePathname();

  const openModal = () => {
    setIsShowUserInfo(true);
  };

  const closeModal = () => {
    setIsShowUserInfo(false);
  };

  if (!session) {
    return null;
  }

  return (
    <aside className="h-full bg-stone-100">
      <ul className="flex h-full w-20 flex-col items-center justify-center">
        <SidebarItem
          href={ROUTES.community.all}
          isActive={pathname.startsWith(ROUTES.community.base)}
        >
          <Icon id="users" />
        </SidebarItem>
        <SidebarItem href={ROUTES.home} isActive={pathname.startsWith(ROUTES.chats)}>
          <Icon id="chat" />
        </SidebarItem>
        <SidebarItem>
          <div onClick={openModal} className="relative mx-auto h-10 w-10">
            <UserAvatar
              src={session.user.image}
              username={session.user.name}
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
            {isShowUserInfo && (
              <UserInfo closeModal={closeModal} session={session} socket={socket} />
            )}
          </div>
        </SidebarItem>
      </ul>
    </aside>
  );
}
