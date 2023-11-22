import { ROUTES } from '@/constants/global';
import { customKy } from '@/ky';
import { CommunityLayout } from '@/layouts/community-layout';
import { AllUsersResponse } from '@/types/api';
import { logError } from '@/utils/log-error';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type ServerSidePropsType = {
  session: Session;
  allUsers: AllUsersResponse['data'];
};

export default function AllCommunityPage({
  allUsers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <CommunityLayout>
      <h2>Community/all</h2>
      {allUsers ? <ul>{allUsers.map((user) => user.name)}</ul> : 'Error'}
    </CommunityLayout>
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

  const props: ServerSidePropsType = {
    session,
    allUsers: null,
  };

  try {
    const allUsersResponse = await customKy
      .get(`users/${session.user.id}/all`)
      .json<AllUsersResponse>();

    props.allUsers = allUsersResponse.data;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
