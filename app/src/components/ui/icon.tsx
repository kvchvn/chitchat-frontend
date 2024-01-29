import { IconId } from '~/types/global';

type IconProps = {
  id: IconId;
  className?: string;
};

export function Icon({ id, className = '' }: IconProps) {
  return (
    <svg
      className={`h-full w-full fill-primary-outline-dark dark:fill-primary-outline-light ${className}`}
    >
      <use xlinkHref={`/svg/global.svg#${id}`} />
    </svg>
  );
}
