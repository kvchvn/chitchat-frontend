import classNames from 'classnames';
import { Icon } from '~/components/ui/icon';

type ButtonHideProps = {
  isHidden: boolean;
  onClick: () => void;
};

export function ButtonHide({ onClick, isHidden }: ButtonHideProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'dark:hover:bg-primary-bg-darker hover:bg-primary-bg-light absolute right-0 top-0 h-8 w-8',
        {
          'translate-x-8 rotate-180': isHidden,
        }
      )}
    >
      <Icon id="chevron-left" />
    </button>
  );
}
