import { IconId } from '@/types';

type IconProps = {
  id: IconId;
  color: string;
  size: number;
  className?: string;
};

export default function Icon({ id, color, size, className }: IconProps) {
  return (
    <svg width={size} height={size} fill={color} className={className}>
      <use xlinkHref={`/svg/global.svg#${id}`} />
    </svg>
  );
}
