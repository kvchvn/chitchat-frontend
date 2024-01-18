import classNames from 'classnames';
import { UserRelevant } from '~/types/users';
import { isUserSessionExpired } from '~/utils/is-user-session-expired';

type Props = {
  size: 'sm' | 'md' | 'xl';
  userLatestSession?: UserRelevant['sessions'][0];
  onlineStatus?: boolean;
  hiddenOffline?: boolean;
};

export function UserAvatarStatus({
  size,
  userLatestSession,
  onlineStatus = false,
  hiddenOffline = true,
}: Props) {
  const isOnline = onlineStatus || !isUserSessionExpired(userLatestSession);

  return hiddenOffline && !isOnline ? null : (
    <span
      className={classNames(
        'absolute bottom-0 right-0 block h-2 w-2 rounded-full border border-primary-outline-dark dark:border-primary-outline-light',
        {
          'h-2 w-2': size === 'sm',
          'h-3 w-3': size === 'md',
          'h-4 w-4': size === 'xl',
          'bg-success-base-light dark:bg-success-base-dark': isOnline,
          'bg-error-base-light dark:bg-error-base-dark': !isOnline,
        }
      )}
    />
  );
}
