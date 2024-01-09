import { LocalStorage } from '~/types/global';

export const getFromLocalStorage = (key: keyof LocalStorage) => localStorage.getItem(key);

export const setToLocalStorage = (key: keyof LocalStorage, value: LocalStorage[typeof key]) =>
  localStorage.setItem(key, value);
