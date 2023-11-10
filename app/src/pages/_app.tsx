import { useSocketInitialization } from '@/hooks';
import { RootLayout } from '@/layouts/root-layout';
import { useSocketSelector } from '@/store';
import '@/styles/globals.css';
import { PageProps } from '@/types';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  useSocketInitialization({ userId: pageProps.session?.user.id });
  console.log('App render');

  const socket = useSocketSelector();
  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout socket={socket} {...pageProps}>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
