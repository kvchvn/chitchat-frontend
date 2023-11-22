import { USERS_CATEGORIES } from '@/constants/users';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CommunityHeader() {
  const pathname = usePathname();

  console.log('TABS: ', pathname);

  return (
    <header>
      <h2 className="text-2xl font-semibold">Community</h2>
      <ul className="horizontal-scroll flex justify-between overflow-hidden hover:overflow-auto">
        {(Object.entries(USERS_CATEGORIES) as [[keyof typeof USERS_CATEGORIES, string]]).map(
          ([categoryKey, categoryValue]) => (
            <li
              className={classNames('w-full whitespace-nowrap border-b-[3px] text-center text-sm', {
                'border-stone-600': pathname === categoryKey,
                'border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500':
                  pathname !== categoryKey,
              })}
              key={categoryKey}
            >
              <Link href={categoryKey} className="flex h-full w-full items-center gap-2 px-4 py-2">
                {categoryValue}
                {/* {typeof usersTypesCounts?.[typeKey] === 'number' ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 p-1 text-xs">
                {usersTypesCounts[typeKey]}
              </span>
            ) : null} */}
              </Link>
            </li>
          )
        )}
      </ul>
    </header>
  );
}
