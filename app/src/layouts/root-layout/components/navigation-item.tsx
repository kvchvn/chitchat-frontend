import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

type NavigationItemProps = PropsWithChildren &
  ({ href: string; label: string } | { href?: undefined; label?: undefined });

export function NavigationItem({ href, label, children }: NavigationItemProps) {
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
          <div className="flex h-full w-full items-center justify-center">{children}</div>
          <p
            className={classNames('hidden w-full py-2 pl-2 font-mono font-medium lg:block', {
              'bg-primary-bg-light font-semibold dark:bg-primary-bg-darkest': isActive,
              'group-hover:bg-primary-outline-light dark:group-hover:text-primary-outline-dark':
                !isActive,
            })}
          >
            {label}
          </p>
        </Link>
      ) : (
        children
      )}
    </li>
  );
}
