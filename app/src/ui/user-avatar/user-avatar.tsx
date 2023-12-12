import { DEFAULT_USERNAME } from '@/constants/chats';
import { Nullable } from '@/types/global';
import Image from 'next/image';
import { DEFAULT_USER } from '~/constants/chats';
import { Nullable } from '~/types/global';
import { Icon } from '../icon';

type UserAvatarProps = {
  username: Nullable<string>;
  src: Nullable<string>;
  size?: number;
  className?: string;
};

export function UserAvatar({ src, size, username, className = '' }: UserAvatarProps) {
  return src ? (
    <Image
      src={src}
      width={size}
      height={size}
      fill={!size}
      alt={`Avatar of ${username ?? DEFAULT_USERNAME}`}
      className={className}
    />
  ) : (
    <Icon id="user" size={size} className={className} />
  );
}
