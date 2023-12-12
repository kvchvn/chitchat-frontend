import { getSessionData } from '~/auth';
import { UsersCategoriesName } from '~/types/users';
import { getGroupOfUsers } from '~/utils/api';
import { UsersList } from '../components/users-list';

export default async function AllUsersPage() {
  const session = await getSessionData();
  const outcomingRequests = await getGroupOfUsers(session?.user.id, 'outcoming-requests');

  return (
    outcomingRequests && (
      <UsersList
        session={session}
        users={outcomingRequests}
        category={UsersCategoriesName.OutcomingRequests}
      />
    )
  );
}
