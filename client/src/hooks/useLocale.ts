import { Locale } from 'stores';
import { useUiStore } from 'hooks';

export type UseLocaleResult = [
  locale: Locale,
  setLocale: (locale: Locale) => void,
];

export const useLocale = (): UseLocaleResult => {
  const uiStore = useUiStore();
  const { locale, setLocale } = uiStore;
  return [locale, setLocale.bind(uiStore)];
};
