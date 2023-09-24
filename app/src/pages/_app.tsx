import { useSocketInitialization } from '@/hooks';
import { RootLayout } from '@/layouts/root-layout';
import '@/styles/globals.css';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

type PageProps = {
  session: Session | null;
};

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  useSocketInitialization();

  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout {...pageProps}>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
