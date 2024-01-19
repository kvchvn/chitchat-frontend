import { NO_MESSAGES_TEXT } from '~/constants/chats';
import { ChatsRecord } from '~/types/chats';
import { getTime } from '~/utils/date';

type Props = {
  lastChatMessage: ChatsRecord['']['lastMessage'];
};

export function ChatPreview({ lastChatMessage }: Props) {
  return (
    <div className="flex max-w-[60%] flex-col">
      {lastChatMessage ? (
        <>
          <p className="truncate text-sm text-primary-base-600 dark:text-primary-base-200">
            {lastChatMessage.content}
          </p>
          <p className="font-mono text-xs text-gray-400">[{getTime(lastChatMessage.createdAt)}]</p>
        </>
      ) : (
        <p className="text-sm font-light text-gray-400">{NO_MESSAGES_TEXT}</p>
      )}
    </div>
  );
}
