import { ROUTES } from '@/constants/global';
import { GetServerSideProps } from 'next';

export default function CommunityPage() {}

export const getServerSideProps = (async () => {
  return {
    redirect: {
      permanent: true,
      destination: ROUTES.community.all,
    },
  };
}) satisfies GetServerSideProps;
