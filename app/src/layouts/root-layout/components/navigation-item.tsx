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
    <li className="relative h-full w-14">
      {href ? (
        <Link
          href={href}
          className={classNames(
            'flex h-full w-full items-center justify-center border-t-[3px] px-2',
            {
              'border-primary-bg-dark dark:border-primary-bg-darker': isActive,
              'border-transparent hover:border-primary-bg-light': !isActive,
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
