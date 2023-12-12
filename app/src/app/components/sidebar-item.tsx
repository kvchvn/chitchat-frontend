'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

type SidebarItemProps = PropsWithChildren & {
  href?: string;
};

export function SidebarItem({ href, children }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = href && pathname ? pathname.startsWith(href) : false;

  return (
    <li className="relative h-12 w-full">
      {href ? (
        <Link
          href={href}
          className={classNames('block h-full w-full border-r-[3px] py-1', {
            'border-stone-600': isActive,
            'border-stone-300 hover:border-stone-400': !isActive,
          })}
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </li>
  );
}
