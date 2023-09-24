import { API_ENDPOINTS, ROUTES } from '@/constants';
import { customKy } from '@/ky';
import { GetUsersResponse } from '@/types';
import { logError } from '@/utils';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from './api/auth/[...nextauth]';

export default function HomePage({
  friends,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <h2 className="text-2xl font-semibold">Home Page</h2>
      {!friends && <p>Fetching error</p>}
      {friends && (
        <ul className="mt-3">
          {friends.map((friend) => (
            <li key={friend.id} className="h-22 flex gap-3 border-y">
              {friend.image && (
                <Image
                  src={friend.image}
                  width={56}
                  height={56}
                  alt="User's avatar"
                  className="shrink-0 rounded-full p-2"
                />
              )}
              <div className="flex h-full flex-col">
                <p>{friend.name}</p>
                <p className="text-sm text-gray-500">There are no messages yet.</p>
              </div>
            </li>
          ))}
        </ul>
      )}
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

  const props: { session: Session } & { friends: GetUsersResponse['friends'] } = {
    session,
    friends: null,
  };

  try {
    const friends: GetUsersResponse['friends'] = await customKy
      .get(API_ENDPOINTS.users.friends(session.user.id))
      .json();

    props.friends = friends;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps<{ session: Session }>;
