import { ROUTES } from '@/constants';
import { GetServerSideProps } from 'next';
import { Session, getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

type ProfilePageProps = {
  session: Session;
};

export default function ProfilePage({ session }: ProfilePageProps) {
  const handleClick = () => {
    signOut();
  };

  return (
    <div>
      <h2>{`Hello, ${session?.user?.name ? session.user.name : 'anonymous'}!`}</h2>
      <p>
        Your email:{' '}
        <span className="italic">{session.user?.email ? session.user.email : 'unknown'}</span>
      </p>
      <button
        onClick={handleClick}
        className="mt-4 rounded-2xl border-2 border-red-900 bg-red-300 px-4 py-1 font-semibold text-red-900 hover:bg-red-400"
      >
        Sign Out
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.signIn,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
