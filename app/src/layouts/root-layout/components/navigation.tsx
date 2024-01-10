import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Icon } from '~/components/ui/icon';
import { ROUTES } from '~/constants/global';
import { ButtonHide } from './button-hide';
import { ChatIcon } from './chat-icon';
import { NavigationItem } from './navigation-item';
import { ThemeToggler } from './theme-toggler';
import { UserInfo } from './user-info';

export function Navigation() {
  const { data: session } = useSession();

  const [isHidden, setIsHidden] = useState(false);

  if (!session) {
    return null;
  }

  const onHide = () => {
    setIsHidden((prevValue) => !prevValue);
  };

  return (
    <nav
      className={classNames(
        'bg-primary-bg-lightest dark:bg-primary-bg-dark relative flex h-full w-14 shrink-0 flex-col',
        { '-translate-x-14': isHidden }
      )}
    >
      <ul className="flex h-full flex-col items-center justify-center">
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
      <ThemeToggler />
      <ButtonHide isHidden={isHidden} onClick={onHide} />
    </nav>
  );
}
