import Image from 'next/image';
import { useState } from 'react';
import { DEFAULT_USER } from '~/constants/chats';
import { Nullable } from '~/types/global';
import { Icon } from './icon';

type UserAvatarProps = {
  username?: Nullable<string>;
  src?: Nullable<string>;
  size?: number;
  className?: string;
};

export function UserAvatar({ src, size, username, className = '' }: UserAvatarProps) {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
  };

  return src && !isError ? (
    <Image
      src={src}
      width={size}
      height={size}
      fill={!size}
      onError={handleError}
      alt={`Avatar of ${username ?? DEFAULT_USER.username}`}
      className={className}
    />
  ) : (
    <Icon id="user" size={size} className={className} />
  );
}
