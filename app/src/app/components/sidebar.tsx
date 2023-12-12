import { getSessionData } from '~/auth';
import { ROUTES } from '~/constants/global';
import { Icon } from '~/ui/icon';
import { SidebarItem } from './sidebar-item';
import { UserInfoSidebarItem } from './user-info-sidebar-item';

export async function Sidebar() {
  const session = await getSessionData({ allowRedirect: false });

  if (!session?.user) {
    return null;
  }

  return (
    <aside className="h-full bg-stone-100">
      <ul className="flex h-full w-20 flex-col items-center justify-center">
        <SidebarItem href={ROUTES.community.base}>
          <Icon id="users" />
        </SidebarItem>
        <SidebarItem href={ROUTES.chats}>
          <Icon id="chat" />
        </SidebarItem>
        <UserInfoSidebarItem user={session.user} />
      </ul>
    </aside>
  );
}
