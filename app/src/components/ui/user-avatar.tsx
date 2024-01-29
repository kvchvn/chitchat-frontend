import Image from 'next/image';
import { useState } from 'react';
import { DEFAULT_USER } from '~/constants/chats';
import { Nullable } from '~/types/global';
import { Icon } from './icon';

type UserAvatarProps = {
  username: Nullable<string> | undefined;
  src: Nullable<string> | undefined;
  className?: string;
};

export function UserAvatar({ src, username, className = '' }: UserAvatarProps) {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
  };

  return src && !isError ? (
    <Image
      src={src}
      fill={true}
      onError={handleError}
      alt={`Avatar of ${username ?? DEFAULT_USER.username}`}
      className={className}
    />
  ) : (
    <Icon id="user" className={className} />
  );
}
