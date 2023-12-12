import { getSessionData } from '~/auth';
import { UsersCategoriesName } from '~/types/users';
import { getGroupOfUsers } from '~/utils/api';
import { UsersList } from '../components/users-list';

export default async function AllUsersPage() {
  const session = await getSessionData();
  const friends = await getGroupOfUsers(session?.user.id, 'friends');

  return (
    friends && (
      <UsersList session={session} users={friends} category={UsersCategoriesName.Friends} />
    )
  );
}
