import { LocalStorage, Nullable } from '~/types/global';
import { getFromLocalStorage, setToLocalStorage } from './storage';

export const disableScrolling = <T extends Nullable<HTMLElement>>(element: T) => {
  element && (element.style.overflow = 'hidden');
};

export const enableScrolling = <T extends Nullable<HTMLElement>>(element: T) => {
  element && (element.style.overflow = 'auto');
};

export const setAppTheme = (theme: LocalStorage['theme']) => {
  setToLocalStorage('theme', theme);

  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark');
      break;
  }
};

export const toggleAppTheme = () => {
  const storedTheme = getFromLocalStorage('theme');
  const isCurrentThemeDark = document.documentElement.classList.contains('dark');

  if (isCurrentThemeDark && storedTheme === 'dark') {
    setAppTheme('light');
  } else {
    setAppTheme('dark');
  }
};
