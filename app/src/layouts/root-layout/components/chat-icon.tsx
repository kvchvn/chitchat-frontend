import { Icon } from '~/components/ui/icon';
import { useUnreadChatsIdsCount } from '~/store/selectors/chat-selectors';

export function ChatIcon() {
  const unreadChatsIdsCount = useUnreadChatsIdsCount();

  return (
    <div className="relative h-full">
      <Icon id={unreadChatsIdsCount ? 'chat-unread' : 'chat'} />
    </div>
  );
}
