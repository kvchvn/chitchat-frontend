import { ROUTES } from '@/constants';
import Icon from '@/ui/icon';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import UserInfo from './user-info';

type SidebarProps = {
  session: Session | null;
};

export default function Sidebar({ session }: SidebarProps) {
  const [isShowUserInfo, setIsShowUserInfo] = useState(false);
  const pathname = usePathname();

  const handleMouseOver = () => {
    setIsShowUserInfo(true);
  };

  const handleMouseOut = () => {
    setIsShowUserInfo(false);
  };

  if (!session) {
    return null;
  }

  return (
    <aside>
      {session.user?.image && (
        <ul className="flex h-full w-20 flex-col items-center justify-center bg-sky-100 py-6">
          <li className="mt-auto h-12 w-12">
            <Link href={ROUTES.home} className={pathname === ROUTES.home ? 'active-link' : ''}>
              <Icon id="message" size={25} color="black" />
            </Link>
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
