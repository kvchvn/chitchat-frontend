import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useSocketDisconnection } from '~/hooks/use-socket-disconnection';
import { getSessionData } from '~/utils/get-session-data';
import { gsspRedirectToHome } from '~/utils/gssp-redirect';

export default function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useSocketDisconnection();
  console.log({ providers });
  return (
    <>
      <Head>
        <title>Sign In | Chit-Chat</title>
      </Head>
      <h2 className="text-2xl font-semibold">Please, Sign In to use our app!</h2>
      {providers ? (
        <ul className="mt-5 flex flex-col gap-3">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="w-1/3 border-2 border-gray-800 px-4 py-1 hover:bg-gray-300"
            >{`Sign In with ${provider.name}`}</button>
          ))}
        </ul>
      ) : (
        'Cannot fetch the providers'
      )}
    </>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getSessionData(req, res);

  if (session) {
    return gsspRedirectToHome();
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}) satisfies GetServerSideProps;
