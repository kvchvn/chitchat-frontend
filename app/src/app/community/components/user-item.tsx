'use client';

import { PropsWithChildren } from 'react';
import { UserRelevant, UserRelevantWithStatus } from '~/types/users';

type UserItemProps = PropsWithChildren & {
  user: UserRelevant | UserRelevantWithStatus;
};

export function UserItem({ user, children: childrenControls }: UserItemProps) {
  return (
    <li className="flex justify-between">
      <p>
        {user.name} - {user.email}
      </p>
      <div className="border-2 border-blue-600 bg-sky-300 px-3 py-1 hover:bg-sky-500">
        {childrenControls}
      </div>
    </li>
  );
}
