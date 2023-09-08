import { Session } from 'next-auth';
import Sidebar from './sidebar';

type RootLayoutProps = {
  children: React.ReactNode;
  session: Session | null;
};

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <>
      <main className="flex h-full">
        <Sidebar session={session} />
        <div className="w-full px-10 pt-5">{children}</div>
      </main>
    </>
  );
}
