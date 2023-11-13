import { TYPES_OF_USERS } from '@/constants';
import { UserKeys, Users } from '@/types';
import classNames from 'classnames';
import { useState } from 'react';
import { UsersList } from './users-list';

type UsersSectionProps = {
  users: Users;
};

export function UsersSection({ users }: UsersSectionProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof TYPES_OF_USERS>('allUsers');

  const handleClick = (type: keyof typeof TYPES_OF_USERS) => {
    setSelectedType(type);
  };

  return (
    <section className="mt-2">
      <ul className="flex justify-between border-b-2 border-stone-600">
        {Object.entries(TYPES_OF_USERS).map(([typeKey, typeValue]) => (
          <li
            className={classNames('w-full whitespace-nowrap border border-b-0 text-center', {
              'border-2 border-stone-600 bg-stone-200 font-semibold': selectedType === typeKey,
              'border-stone-400 hover:bg-stone-100': selectedType !== typeKey,
            })}
            key={typeKey}
          >
            <button
              onClick={() => handleClick(typeKey as UserKeys)}
              className="h-full w-full px-4 py-2"
            >
              {typeValue}
            </button>
          </li>
        ))}
      </ul>
      <UsersList users={users[selectedType]} />
    </section>
  );
}
