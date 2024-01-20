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
    <li className="group relative h-full w-14 xs:h-16 xs:w-full">
      {href ? (
        <Link
          href={href}
          className={classNames(
            'flex h-full w-full items-center justify-center gap-2 border-t-[3px] px-2 xs:border-r-[3px] xs:border-t-0 xs:px-0 xs:py-3 lg:border-none',
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
