import { ROUTES } from '@/constants/global';
import { GetServerSideProps } from 'next';

export default function HomePage() {}

export const getServerSideProps = (async () => {
  return {
    redirect: {
      permanent: true,
      destination: ROUTES.chats,
    },
  };
}) satisfies GetServerSideProps;
