import { useSocketInitialization } from '@/hooks/use-socket-initialization';
import { RootLayout } from '@/layouts/root-layout';
import { useSocketSelector } from '@/store/selectors/socket-selectors';
import '@/styles/globals.css';
import { PageProps } from '@/types/global';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

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
