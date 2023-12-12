import { redirect } from 'next/navigation';
import { ROUTES } from '~/constants/global';

export default function HomePage() {
  redirect(ROUTES.chats);
}
