import { useSession } from 'next-auth/react';
import { Icon } from '~/components/ui/icon';
import { ROUTES } from '~/constants/global';
import { ChatIcon } from './chat-icon';
import { NavigationItem } from './navigation-item';
import { ThemeToggler } from './theme-toggler';
import { UserIcon } from './user-icon';

export function Navigation() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className="relative flex h-14 w-full items-center justify-center bg-primary-bg-lightest px-2 dark:bg-primary-bg-dark xs:h-full xs:w-16 xs:px-0 lg:w-fit">
      <ul className="flex h-full items-center justify-center xs:flex-col">
        <NavigationItem href={ROUTES.community.base}>
          <Icon id="users" />
        </NavigationItem>
        <NavigationItem href={ROUTES.chats}>
          <ChatIcon />
        </NavigationItem>
        <NavigationItem href={ROUTES.profile}>
          <UserIcon />
        </NavigationItem>
      </ul>
      <ThemeToggler />
    </nav>
  );
}
