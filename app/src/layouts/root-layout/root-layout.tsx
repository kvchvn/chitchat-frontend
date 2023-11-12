import { CustomSocket, Nullable } from '@/types';
import { Session } from 'next-auth';
import { PropsWithChildren } from 'react';
import { Sidebar } from './sidebar';

type RootLayoutProps = PropsWithChildren & {
  socket: Nullable<CustomSocket>;
  session?: Nullable<Session>;
};

export function RootLayout({ children, session, socket }: RootLayoutProps) {
  return (
    <>
      <main className="flex h-full">
        <Sidebar socket={socket} session={session} />
        <div className="mx-auto w-[90vw] px-10 py-5">{children}</div>
      </main>
    </>
  );
}
