import { ROUTES } from '@/constants';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions, prisma } from './api/auth/[...nextauth]';

type HomePageProps = {
  session: Session;
  allUsers: User[];
};

export default function HomePage({ allUsers }: HomePageProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Home Page</h2>
      <section>
        <h4 className="my-3 text-lg">All users:</h4>
        <ul className=" flex flex-col gap-3">
          {allUsers.map((user) => (
            <li key={user.id} className="flex items-center gap-5">
              {user.image && (
                <Image
                  src={user.image}
                  width={30}
                  height={30}
                  alt={`${user.name} avatar`}
                  className="rounded-full"
                />
              )}
              <p>{user.name || 'Anonymous'}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
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

  const allUsers = await prisma.user.findMany();

  return {
    props: {
      session,
      allUsers,
    },
  };
};
