import { ROUTES } from '@/constants';
import { Nullable } from '@/types';
import { Icon } from '@/ui/icon';
import { UserAvatar } from '@/ui/user-avatar';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SidebarItem } from './sidebar-item';
import { UserInfo } from './user-info';

type SidebarProps = {
  session?: Nullable<Session>;
};

export function Sidebar({ session }: SidebarProps) {
  //const socket = useSocketSelector();
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
    <aside className="h-full bg-slate-200">
      <ul className="flex h-full w-20 flex-col items-center justify-center gap-4">
        <SidebarItem href={ROUTES.people} isActive={pathname === ROUTES.people}>
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
            {isShowUserInfo && <UserInfo closeModal={closeModal} session={session} />}
          </div>
        </SidebarItem>
      </ul>
    </aside>
  );
}
