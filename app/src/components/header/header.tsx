import { ROUTES } from '@/constants';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  session: Session | null;
};

export function Header({ session }: HeaderProps) {
  return (
    <header className="flex justify-between bg-slate-800 px-10 py-5 text-white">
      <h1 className="border-b border-transparent text-xl font-bold hover:border-b hover:border-b-white">
        <Link href={ROUTES.home}>Chit-Chat</Link>
      </h1>
      <ul className="flex gap-3">
        <li className="border-b border-transparent hover:border-b hover:border-b-white">
          <Link href={ROUTES.about}>About</Link>
        </li>

        {session ? (
          <li className="flex gap-2 border-b border-transparent hover:border-b hover:border-b-white">
            <Link href={ROUTES.profile}>{session.user ? session.user.name : 'Profile'}</Link>
            {session.user?.image && (
              <Image
                src={session.user.image}
                width={30}
                height={30}
                alt="avatar"
                className="rounded-full"
              />
            )}
          </li>
        ) : (
          <li className="border-b border-transparent hover:border-b hover:border-b-white">
            <Link href={ROUTES.signIn}>Sign In</Link>
          </li>
        )}
      </ul>
    </header>
  );
}
