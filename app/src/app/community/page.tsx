import { redirect } from 'next/navigation';
import { ROUTES } from '~/constants/global';

export default function CommunityPage() {
  redirect(ROUTES.community.all);
}
