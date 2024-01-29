type Props = {
  unreadMessagesCount: number;
};

export function ChatUnreadMessagesCount({ unreadMessagesCount }: Props) {
  if (!unreadMessagesCount) {
    return null;
  }

  return (
    <span className="bg-warning-base-light dark:bg-warning-base-dark absolute right-1 h-7 w-7 rounded-full text-center font-mono leading-7 text-white">
      {unreadMessagesCount <= 9 ? unreadMessagesCount : '9+'}
    </span>
  );
}
