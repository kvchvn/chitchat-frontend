import { Message } from '@prisma/client';
import classNames from 'classnames';
import { Icon } from '~/components/ui/icon';
import { getTime } from '~/utils/date';

type Props = {
  isCurrentUser: boolean;
  message: Message;
};

export function MessageStatusBar({ isCurrentUser, message }: Props) {
  return (
    <div
      className={classNames('mt-2 flex items-center gap-1', {
        'flex-row-reverse justify-end fill-gray-500 text-gray-500 dark:fill-gray-700 dark:text-gray-700':
          isCurrentUser,
        'fill-gray-600 text-gray-600 dark:fill-gray-800 dark:text-gray-800 md:flex-row-reverse':
          !isCurrentUser,
      })}
    >
      <p className="font-mono text-xs">{getTime(message.createdAt)}</p>
      {message.isEdited && (
        <span className="h-4 w-4">
          <Icon id="pencil" className="!fill-inherit" />
        </span>
      )}
      {message.isLiked && (
        <span className="h-4 w-4">
          <Icon id="like" className="!fill-rose-500 dark:!fill-rose-700" />
        </span>
      )}
      {isCurrentUser && message.isRead && (
        <span className="h-4 w-4">
          <Icon id="check" className="!fill-inherit" />
        </span>
      )}
    </div>
  );
}
