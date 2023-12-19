import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { USERS_CATEGORIES } from '~/constants/users';
import {
  useCategoriesCountSelector,
  useCommunityActionsSelector,
} from '~/store/selectors/community-selectors';
import { isCommunityPathname } from '~/types/guards';

export function Header() {
  const categoriesCount = useCategoriesCountSelector();
  const { setCurrentCategory, resetCurrentCategory } = useCommunityActionsSelector();

  const { pathname: currentPathname } = useRouter();

  console.log('TABS: ', currentPathname);

  useEffect(() => {
    if (isCommunityPathname(currentPathname)) {
      setCurrentCategory(USERS_CATEGORIES[currentPathname].label);
    }

    return () => {
      resetCurrentCategory();
    };
  }, [setCurrentCategory, resetCurrentCategory, currentPathname]);

  return (
    <header>
      <h2 className="text-2xl font-semibold">Community</h2>
      <ul className="horizontal-scroll flex justify-between overflow-hidden hover:overflow-auto">
        {Object.entries(USERS_CATEGORIES).map(
          ([categoryKey, { name: categoryName, label: categoryLabel }]) => (
            <li
              className={classNames('w-full whitespace-nowrap border-b-[3px] text-center text-sm', {
                'border-stone-600': currentPathname === categoryKey,
                'border-stone-400 text-stone-400 hover:border-stone-500 hover:text-stone-500':
                  currentPathname !== categoryKey,
              })}
              key={categoryKey}
            >
              <Link href={categoryKey} className="flex h-full w-full items-center gap-2 px-4 py-2">
                {categoryName}
                {categoriesCount && (
                  <span className="font-bold">{categoriesCount[categoryLabel]}</span>
                )}
              </Link>
            </li>
          )
        )}
      </ul>
    </header>
  );
}
