import classNames from 'classnames';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

type SidebarItemProps = PropsWithChildren & {
  href?: string;
  isActive?: boolean;
};

export function SidebarItem({ href, isActive, children }: SidebarItemProps) {
  return (
    <li className="relative h-12 w-full">
      {href ? (
        <Link
          href={href}
          className={classNames(
            'block h-full w-full border-r-2 border-transparent py-1 hover:bg-stone-200',
            {
              'active-link': isActive,
            }
          )}
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </li>
  );
}
