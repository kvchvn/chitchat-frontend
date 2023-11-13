import { TYPES_OF_USERS } from '@/constants';
import { UserKeys } from '@/types';
import classNames from 'classnames';

type TabsProps = {
  selectedTab: keyof typeof TYPES_OF_USERS;
  toggleTabs: (tab: keyof typeof TYPES_OF_USERS) => void;
};

export function Tabs({ selectedTab, toggleTabs }: TabsProps) {
  return (
    <ul className="flex justify-between border-b-2 border-stone-600">
      {Object.entries(TYPES_OF_USERS).map(([typeKey, typeValue]) => (
        <li
          className={classNames('w-full whitespace-nowrap border border-b-0 text-center', {
            'border-2 border-stone-600 bg-stone-200 font-semibold': selectedTab === typeKey,
            'border-stone-400 hover:bg-stone-100': selectedTab !== typeKey,
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
