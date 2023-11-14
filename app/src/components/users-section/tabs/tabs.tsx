import { TYPES_OF_USERS } from '@/constants';
import { UserKeys } from '@/types';
import classNames from 'classnames';

type TabsProps = {
  selectedTab: keyof typeof TYPES_OF_USERS;
  toggleTabs: (tab: keyof typeof TYPES_OF_USERS) => void;
};

export function Tabs({ selectedTab, toggleTabs }: TabsProps) {
  return (
    <ul className="flex justify-between">
      {Object.entries(TYPES_OF_USERS).map(([typeKey, typeValue]) => (
        <li
          className={classNames('w-full whitespace-nowrap border-b-[3px] text-center text-sm', {
            'border-stone-600': selectedTab === typeKey,
            'border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500':
              selectedTab !== typeKey,
          })}
          key={typeKey}
        >
          <button
            onClick={() => toggleTabs(typeKey as UserKeys)}
            className="h-full w-full px-4 py-2"
          >
            {typeValue}
          </button>
        </li>
      ))}
    </ul>
  );
}
