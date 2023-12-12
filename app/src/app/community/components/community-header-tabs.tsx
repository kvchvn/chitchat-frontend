'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { USERS_CATEGORIES } from '~/constants/users';
import {
  useCategoriesCountSelector,
  useCommunityActionsSelector,
} from '~/store/selectors/community-selectors';
import { Nullable } from '~/types/global';
import { isCommunityPathname } from '~/types/guards';
import { UsersCategoriesCount } from '~/types/users';

type CommunityHeaderTabsProps = {
  categories: Nullable<UsersCategoriesCount>;
};

export function CommunityHeaderTabs({
  categories: categoriesCountFromProps,
}: CommunityHeaderTabsProps) {
  const categoriesCount = useCategoriesCountSelector();
  const { setCategoriesCount, resetCategoriesCount, setCurrentCategory, resetCurrentCategory } =
    useCommunityActionsSelector();

  const currentPathname = usePathname();

  useEffect(() => {
    if (categoriesCountFromProps) {
      setCategoriesCount(categoriesCountFromProps);
    }

    return () => {
      resetCategoriesCount();
    };
  }, [categoriesCountFromProps, setCategoriesCount, resetCategoriesCount]);

  useEffect(() => {
    if (isCommunityPathname(currentPathname)) {
      setCurrentCategory(USERS_CATEGORIES[currentPathname].label);
    }

    return () => {
      resetCurrentCategory();
    };
  }, [currentPathname, setCurrentCategory, resetCurrentCategory]);

  return (
    <ul className="flex gap-4 border-b border-stone-400">
      {Object.entries(USERS_CATEGORIES).map(
        ([categoryPathname, { name: categoryName, label: categoryLabel }]) => (
          <li
            key={categoryPathname}
            className={classNames('flex gap-2', {
              'border-b border-stone-600': currentPathname === categoryPathname,
              '': currentPathname !== categoryPathname,
            })}
          >
            <Link href={categoryPathname}>{categoryName}</Link>
            <span className="font-bold">{categoriesCount?.[categoryLabel] ?? ''}</span>
          </li>
        )
      )}
    </ul>
  );
}
