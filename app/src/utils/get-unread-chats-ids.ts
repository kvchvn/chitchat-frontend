import { ChatsRecord } from '~/types/chats';

export const getUnreadChatsIds = ({
  chats,
  sessionUserId,
}: {
  chats: ChatsRecord;
  sessionUserId: string;
}) => {
  const unreadChatIds: string[] = [];

  for (const [chatId, { unreadMessagesCount, lastMessage }] of Object.entries(chats)) {
    if (unreadMessagesCount && lastMessage?.senderId !== sessionUserId) {
      unreadChatIds.push(chatId);
    }
  }

  return unreadChatIds;
};
