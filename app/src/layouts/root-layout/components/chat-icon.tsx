import { Icon } from '~/components/ui/icon';
import { useUnreadChatsIdsCount } from '~/store/selectors/chat-selectors';

export function ChatIcon() {
  const unreadChatsIdsCount = useUnreadChatsIdsCount();

  return unreadChatsIdsCount ? <Icon id="chat-unread" /> : <Icon id="chat" />;
}
