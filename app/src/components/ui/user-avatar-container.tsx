import React, { PropsWithChildren } from 'react';
import { UserRelevant } from '~/types/users';

type Props = PropsWithChildren & {
  onClick?: (e?: React.MouseEvent) => void;
  userLatestSession?: UserRelevant['sessions'][0];
  onlineStatus?: boolean;
  hiddenOffline?: boolean;
  className?: string;
};

export function UserAvatarContainer({
  children,
  onClick,

  className = '',
}: Props) {
  return (
    <div onClick={onClick} className={`relative ${className}`}>
      {children}
    </div>
  );
}
