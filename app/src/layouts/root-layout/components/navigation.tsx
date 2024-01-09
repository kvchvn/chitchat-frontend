import { useSession } from 'next-auth/react';
import { Icon } from '~/components/ui/icon';
import { ROUTES } from '~/constants/global';
import { ChatIcon } from './chat-icon';
import { NavigationItem } from './navigation-item';
import { ThemeToggler } from './theme-toggler';
import { UserInfo } from './user-info';

export function Navigation() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className="flex h-full flex-col bg-stone-100">
      <ThemeToggler />
      <ul className="flex h-full w-20 flex-col items-center justify-center">
        <NavigationItem href={ROUTES.community.base}>
          <Icon id="users" />
        </NavigationItem>
        <NavigationItem href={ROUTES.chats}>
          <ChatIcon />
        </NavigationItem>
        <NavigationItem>
          <UserInfo />
        </NavigationItem>
      </ul>
    </nav>
  );
}
