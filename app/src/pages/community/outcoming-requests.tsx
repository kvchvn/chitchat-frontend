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
  outcomingRequests: UsersResponse['data'];
};

export default function AllCommunityPage({
  outcomingRequests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <CommunityLayout>
      <h2>Community/outcoming-requests</h2>
      {outcomingRequests ? <ul>{outcomingRequests.map((user) => user.name)}</ul> : 'Error'}
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
    outcomingRequests: null,
  };

  try {
    const outcomingResponse = await customKy
      .get(`users/${session.user.id}/outcoming-requests`)
      .json<UsersResponse>();

    props.outcomingRequests = outcomingResponse.data;
  } catch (err) {
    logError('HomePage (getServerSideProps)', err);
  }

  return { props };
}) satisfies GetServerSideProps;
