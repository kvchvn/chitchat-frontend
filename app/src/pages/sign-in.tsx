import { ROUTES } from '@/constants';
import { useSocketDisconnection } from '@/hooks';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { getProviders, signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useSocketDisconnection();

  return (
    <>
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

export const getServerSideProps = (async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.home,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}) satisfies GetServerSideProps;
