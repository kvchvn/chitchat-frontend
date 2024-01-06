import { Icon } from '~/components/ui/icon';
import { useUnreadChatsIdsCount } from '~/store/selectors/chat-selectors';

export function ChatIcon() {
  const unreadChatsIdsCount = useUnreadChatsIdsCount();

  return (
    <div className="relative inline">
      <Icon id="chat" />
      {unreadChatsIdsCount ? (
        <span className=" absolute right-3 top-1 block h-3 w-3 rounded-full border-2 border-black bg-orange-500" />
      ) : null}
    </div>
  );
}
