import RootLayout from '@/components/root-layout';
import '@/styles/globals.css';
import { Session } from 'next-auth';
import type { AppProps } from 'next/app';

type PageProps = {
  session: Session | null;
};

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <SessionProvider session={pageProps.session}>
    <RootLayout {...pageProps}>
      <Component {...pageProps} />
        <Component socket={socketRef.current} {...pageProps} />
    </RootLayout>
    </SessionProvider>
  );
}
