import { Nullable } from 'types';

export const getFromLocalStorage = <T>(
  key: string,
  fallbackValue: Nullable<T> = null,
): Nullable<T> => {
  const cachedValue = localStorage.getItem(key);
  return cachedValue ? (JSON.parse(cachedValue) as T) : fallbackValue;
};

export const saveToLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};
