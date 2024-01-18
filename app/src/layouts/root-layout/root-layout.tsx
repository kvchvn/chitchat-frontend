import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { ROUTES } from '~/constants/global';
import { Navigation } from './components/navigation';

export function RootLayout({ children }: PropsWithChildren) {
  const { pathname } = useRouter();

  return (
    <>
      {pathname === ROUTES.home ? null : <Navigation />}
      <div className="h-full px-2 py-4 dark:bg-primary-bg-darkest">{children}</div>
    </>
  );
}
