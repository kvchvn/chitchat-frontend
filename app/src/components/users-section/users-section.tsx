import { Users } from '@/types';
import { Tabs } from './tabs';
import { UsersList } from './users-list';
import { UsersListProvider } from './users-list-provider';

type UsersSectionProps = {
  users: Users;
};

export function UsersSection({ users }: UsersSectionProps) {
  return (
    <UsersListProvider>
      <section className="mt-2">
        <Tabs />
        <UsersList users={users} />
      </section>
    </UsersListProvider>
  );
}
