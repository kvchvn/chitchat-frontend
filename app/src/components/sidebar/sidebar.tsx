import { ROUTES } from '@/constants';
import { useSocketSelector } from '@/store';
import Icon from '@/ui/icon';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { UserInfo } from '../user-info';

type SidebarProps = {
  session: Session | null;
};

export function Sidebar({ session }: SidebarProps) {
  const socket = useSocketSelector();
  const [isShowUserInfo, setIsShowUserInfo] = useState(false);
  const pathname = usePathname();

  const handleMouseOver = () => {
    setIsShowUserInfo(true);
  };

  const handleMouseOut = () => {
    setIsShowUserInfo(false);
  };

  const handleClick = () => {
    signOut();
  };

  if (!session) {
    return null;
  }

  return (
    <aside className="bg-sky-100 py-6">
      <h3
        className={`${
          socket ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'
        } mb-4 text-center text-xl font-semibold italic`}
      >
        {socket ? 'ON' : 'OFF'}
      </h3>
      {session.user?.image && (
        <ul className="flex h-full w-20 flex-col items-center justify-start gap-3">
          <li className="h-12 w-12">
            <Link
              href={ROUTES.people}
              className={`${
                pathname === ROUTES.people && 'active-link'
              } flex h-full w-full items-center justify-center`}
            >
              <Icon id="people-searching" size={35} />
            </Link>
          </li>
          <li className="h-12 w-12">
            <Link
              href={ROUTES.home}
              className={`${
                pathname === ROUTES.home && 'active-link'
              } flex h-full w-full items-center justify-center`}
            >
              <Icon id="message" size={25} />
            </Link>
          </li>
          <li className="h-12 w-12 hover:cursor-pointer" onClick={handleClick}>
            <Icon id="sign-out" />
          </li>
          <li
            className="relative mt-auto w-full"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Image
              src={session.user.image}
              width={30}
              height={30}
              alt="Avatar"
              className="mx-auto rounded-full hover:cursor-pointer"
            />
            {isShowUserInfo && <UserInfo session={session} />}
          </li>
        </ul>
      )}
    </aside>
  );
}