import { GetServerSideProps } from 'next';
import { ROUTES } from '~/constants/global';
import { gsspRedirect } from '~/utils/gssp-redirect';

export default function CommunityPage() {}

export const getServerSideProps = (async () => {
  return gsspRedirect(ROUTES.community.all);
}) satisfies GetServerSideProps;
