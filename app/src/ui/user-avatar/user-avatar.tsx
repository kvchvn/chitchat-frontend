import { Nullable } from '@/types';
import Image from 'next/image';
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
      alt={`Avatar of ${username ?? 'Anonymous'}`}
      className={className}
    />
  ) : (
    <Icon id="user" size={size} className={className} />
  );
}
