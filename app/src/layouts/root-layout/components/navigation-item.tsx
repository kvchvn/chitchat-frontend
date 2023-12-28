import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

type NavigationItemProps = PropsWithChildren & {
  href?: string;
};

export function NavigationItem({ href, children }: NavigationItemProps) {
  const { pathname } = useRouter();

  const isActive = Boolean(href && pathname.startsWith(href));

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
