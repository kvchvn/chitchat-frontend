import { Nullable } from '~/types/global';

export const disableScrolling = <T extends Nullable<HTMLElement>>(element: T) => {
  element && (element.style.overflow = 'hidden');
};

export const enableScrolling = <T extends Nullable<HTMLElement>>(element: T) => {
  element && (element.style.overflow = 'auto');
};
