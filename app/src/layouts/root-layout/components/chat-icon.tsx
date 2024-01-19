import { Icon } from '~/components/ui/icon';
import { useUnreadChatsIdsCount } from '~/store/selectors/chat-selectors';

export function ChatIcon() {
  const unreadChatsIdsCount = useUnreadChatsIdsCount();

  return (
    <div className="relative h-full">
      <Icon id="chat" />
      {unreadChatsIdsCount ? (
        <span className="absolute right-1 top-2 h-2 w-2 rounded-full border border-primary-outline-dark bg-warning-base-light dark:border-primary-outline-light dark:bg-warning-base-dark" />
      ) : null}
    </div>
  );
}
