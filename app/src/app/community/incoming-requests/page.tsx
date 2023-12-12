import { getSessionData } from '~/auth';
import { UsersCategoriesName } from '~/types/users';
import { getGroupOfUsers } from '~/utils/api';
import { UsersList } from '../components/users-list';

export default async function AllUsersPage() {
  const session = await getSessionData();
  const incomingRequests = await getGroupOfUsers(session?.user.id, 'incoming-requests');

  return (
    incomingRequests && (
      <UsersList
        session={session}
        users={incomingRequests}
        category={UsersCategoriesName.IncomingRequests}
      />
    )
  );
}
