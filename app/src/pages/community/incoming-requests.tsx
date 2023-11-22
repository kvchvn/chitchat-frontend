import { ROUTES } from '@/constants/global';
import { customKy } from '@/ky';
import { CommunityLayout } from '@/layouts/community-layout';
import { UsersResponse } from '@/types/api';
import { logError } from '@/utils/log-error';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type ServerSidePropsType = {
  session: Session;
  incomingRequests: UsersResponse['data'];
};

export default function AllCommunityPage({
  incomingRequests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <CommunityLayout>
      <h2>Community/incoming-requests</h2>
      {incomingRequests ? <ul>{incomingRequests.map((user) => user.name)}</ul> : 'Error'}
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
    incomingRequests: null,
  };

  try {
    const incomingRequestsResponse = await customKy
      .get(`users/${session.user.id}/incoming-requests`)
      .json<UsersResponse>();

    props.incomingRequests = incomingRequestsResponse.data;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
