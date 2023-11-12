import { IconId } from '@/types';

type IconProps = {
  id: IconId;
  color?: string;
  size?: number;
  className?: string;
};

export function Icon({ id, color, size, className = '' }: IconProps) {
  return (
    <svg
      width={size ?? '100%'}
      height={size ?? '100%'}
      fill={color ?? '#000000'}
      className={`${className} mx-auto`}
    >
      <use xlinkHref={`/svg/global.svg#${id}`} />
    </svg>
  );
}
