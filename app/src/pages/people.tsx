import { UsersList } from '@/components/users-list';
import { API_ENDPOINTS, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { logError } from '@/lib';
import { Users } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { authOptions } from './api/auth/[...nextauth]';

export default function PeoplePage({
  allUsersExceptOneself,
  friends,
  incomingRequests,
  outcomingRequests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const refreshPage = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">People</h2>
      <button
        onClick={refreshPage}
        className="mt-2 rounded-2xl border-2 border-black bg-gray-400 px-4 py-1 font-semibold hover:bg-gray-700 hover:text-white"
      >
        Update
      </button>
      <UsersList variant="all" users={allUsersExceptOneself} listName="All users" />
      <UsersList
        variant="friends"
        users={friends}
        listName="Friends"
        emptinessMessage="You have no friends."
      />
      <UsersList
        variant="incoming"
        users={incomingRequests}
        listName="Incoming Requests"
        emptinessMessage="You have no incoming requests."
      />
      <UsersList
        variant="outcoming"
        users={outcomingRequests}
        listName="Outcoming Requests"
        emptinessMessage="You have no outcoming requests."
      />
    </>
  );
}

export const getServerSideProps = (async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.signIn,
      },
    };
  }

  const props: {
    session: Session;
  } & Users = {
    session,
    allUsersExceptOneself: null,
    friends: null,
    incomingRequests: null,
    outcomingRequests: null,
  };

  try {
    const users: Users = await customKy.get(API_ENDPOINTS.user.getAll(session.user.id)).json();

    Object.assign(props, users);
  } catch (err) {
    logError('People Page (getServerSideProps)', err);
  }
  return { props };
}) satisfies GetServerSideProps;
