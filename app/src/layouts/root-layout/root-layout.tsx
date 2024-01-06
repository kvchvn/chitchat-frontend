import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { ROUTES } from '~/constants/global';
import { Navigation } from './components/navigation';

export function RootLayout({ children }: PropsWithChildren) {
  const { pathname } = useRouter();

  return (
    <>
      {pathname === ROUTES.home ? null : <Navigation />}
      <div className="mx-auto w-[90vw] px-10 py-5">{children}</div>
    </>
  );
}
