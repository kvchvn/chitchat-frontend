import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useSocketInitialization } from '~/hooks/use-socket-initialization';
import { RootLayout } from '~/layouts/root-layout';
import '~/styles/globals.css';
import { PageProps } from '~/types/global';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout<Props> = AppProps<Props> & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout<PageProps>) {
  useSocketInitialization({ userId: pageProps.session?.user.id });
  console.log('App render');

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
    </SessionProvider>
  );
}
