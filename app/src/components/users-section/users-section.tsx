import { TYPES_OF_USERS } from '@/constants';
import { Users } from '@/types';
import { useState } from 'react';
import { Tabs } from './tabs';
import { UsersList } from './users-list';

type UsersSectionProps = {
  users: Users;
};

export function UsersSection({ users }: UsersSectionProps) {
  const [selectedTab, setSelectedTab] = useState<keyof typeof TYPES_OF_USERS>('allUsers');

  return (
    <section className="mt-2">
      <Tabs selectedTab={selectedTab} toggleTabs={setSelectedTab} />
      <UsersList users={users[selectedTab]} />
    </section>
  );
}
