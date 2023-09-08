import { Session } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import UserInfo from './user-info';

type SidebarProps = {
  session: Session | null;
};

export default function Sidebar({ session }: SidebarProps) {
  const [isShowUserInfo, setIsShowUserInfo] = useState(false);

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
        <ul className="flex h-full w-20 flex-col items-center bg-sky-100 py-6">
          <li
            className="relative mt-auto w-full"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Image
              src={session.user.image}
              width={40}
              height={40}
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
