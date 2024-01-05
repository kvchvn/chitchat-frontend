import { useSession } from 'next-auth/react';
import { ROUTES } from '~/constants/global';
import { Icon } from '~/ui/icon';
import { ChatIcon } from './chat-icon';
import { NavigationItem } from './navigation-item';
import { UserInfo } from './user-info';

export function Navigation() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className="h-full bg-stone-100">
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
