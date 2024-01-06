import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { ErrorBoundary } from '~/components/global/error-boundary';
import { useSocketInitialization } from '~/hooks/use-socket-initialization';
import { useUnreadChatsIdsFetching } from '~/hooks/use-unread-chats-ids-fetching';
import { RootLayout } from '~/layouts/root-layout';
import { onestFont, sometypeMonoFont } from '~/styles/fonts/fonts';
import '~/styles/globals.css';
import { PageProps } from '~/types/global';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout<Props> = AppProps<Props> & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout<PageProps>) {
  useSocketInitialization({
    userId: pageProps.session?.user.id,
    sessionToken: pageProps.session?.sessionToken,
  });

  // for showing indicator if user has unread messages
  useUnreadChatsIdsFetching({ userId: pageProps.session?.user.id });

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ErrorBoundary fallback={<p>Error Boundary</p>}>
      <SessionProvider session={pageProps.session}>
        <main
          className={`${onestFont.variable} ${sometypeMonoFont.variable} flex h-full font-sans`}
        >
          <RootLayout>{getLayout(<Component {...pageProps} />)}</RootLayout>
        </main>
      </SessionProvider>
    </ErrorBoundary>
  );
}
