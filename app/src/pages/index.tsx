import { GetServerSideProps } from 'next';
import { ROUTES } from '~/constants/global';
import { gsspRedirect } from '~/utils/gssp-redirect';

export default function HomePage() {}

export const getServerSideProps = (async () => {
  return gsspRedirect(ROUTES.chats);
}) satisfies GetServerSideProps;
