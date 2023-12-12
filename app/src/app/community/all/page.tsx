import { getSessionData } from '~/auth';
import { UsersCategoriesName } from '~/types/users';
import { getAllUsers } from '~/utils/api';
import { UsersList } from '../components/users-list';

export default async function AllUsersPage() {
  const session = await getSessionData();
  const allUsers = await getAllUsers(session?.user.id);

  return (
    allUsers && <UsersList session={session} users={allUsers} category={UsersCategoriesName.All} />
  );
}
