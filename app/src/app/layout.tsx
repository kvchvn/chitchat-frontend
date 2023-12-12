import { PropsWithChildren } from 'react';
import { getSessionData } from '~/auth';
import { Sidebar } from './components/sidebar';
import { SocketInitializer } from './components/socket-initializer';
import './global.css';

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSessionData({ allowRedirect: false });

  return (
    <html lang="en">
      <body>
        <main className="flex h-full">
          <Sidebar />
          <div className="mx-auto w-[90vw] px-10 py-5">{children}</div>
        </main>
        <SocketInitializer userId={session?.user.id} />
      </body>
    </html>
  );
}
