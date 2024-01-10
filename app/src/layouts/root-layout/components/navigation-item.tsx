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
    <li className="relative h-14 w-full">
      {href ? (
        <Link
          href={href}
          className={classNames('block h-full w-full border-r-[3px] py-3 text-green-600', {
            'dark:border-primary-bg-darker border-primary-bg-dark': isActive,
            'hover:border-primary-bg-light border-transparent': !isActive,
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
