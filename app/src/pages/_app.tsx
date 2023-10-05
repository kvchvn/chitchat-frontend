import { useSocketInitialization } from '@/hooks';
import { RootLayout } from '@/layouts/root-layout';
import '@/styles/globals.css';
import { PageProps } from '@/types';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  useSocketInitialization({ userId: pageProps.session?.user.id });

  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout {...pageProps}>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
