import { Session } from 'next-auth';
import Header from './header';

type RootLayoutProps = {
  children: React.ReactNode;
  session: Session | null;
};

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <>
      <Header session={session} />
      {children}
    </>
  );
}
