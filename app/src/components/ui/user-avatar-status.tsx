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
        'absolute bottom-0 right-0 block rounded-full border-2 border-primary-outline-dark dark:border-primary-outline-light',
        {
          'h-[10px] w-[10px]': size === 'sm',
          'h-3 w-3': size === 'md',
          'h-4 w-4': size === 'xl',
          'bg-success-base-light dark:bg-success-base-dark': isOnline,
          'dark:bg-error-bg-dark bg-error-base-light': !isOnline,
        }
      )}
    />
  );
}
