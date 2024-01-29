import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import Head from 'next/head';
import Link from 'next/link';
import { ROUTES } from '~/constants/global';
import { Nullable } from '~/types/global';
import { getSessionData } from '~/utils/get-session-data';

type ServerSideProps = {
  session: Nullable<Session>;
};

export default function HomePage({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>Home | Chit-Chat</Head>
      <div>
        Welcome to <h1>Chit-Chat</h1>
      </div>
      {session ? (
        <Link href={ROUTES.chats}>Go to chats</Link>
      ) : (
        <Link href={ROUTES.signIn}>Sign In</Link>
      )}
    </>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  return {
    props: { session },
  };
}) satisfies GetServerSideProps<ServerSideProps>;
