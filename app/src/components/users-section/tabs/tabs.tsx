import { TYPES_OF_USERS } from '@/constants';
import { UserKeys } from '@/types';
import classNames from 'classnames';
import { useContext } from 'react';
import { UsersListContext } from '../users-list-provider';

export function Tabs() {
  const { listName, toggleList } = useContext(UsersListContext);

  return (
    <ul className="flex justify-between">
      {Object.entries(TYPES_OF_USERS).map(([typeKey, typeValue]) => (
        <li
          className={classNames('w-full whitespace-nowrap border-b-[3px] text-center text-sm', {
            'border-stone-600': listName === typeKey,
            'border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500':
              listName !== typeKey,
          })}
          key={typeKey}
        >
          <button
            onClick={() => toggleList(typeKey as UserKeys)}
            className="h-full w-full px-4 py-2"
          >
            {typeValue}
          </button>
        </li>
      ))}
    </ul>
  );
}
