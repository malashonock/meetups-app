import { useContext } from 'react';

import { UiStore, Locale } from 'stores';
import { RootContext } from 'components';
import { Optional } from 'types';

export type UseLocaleResult = [
  locale: Optional<Locale>,
  setLocale: (locale: Locale) => void,
];

export const useLocale = (): UseLocaleResult => {
  const uiStore: Optional<UiStore> = useContext(RootContext)?.uiStore;

  const locale = uiStore?.locale;

  const setLocale = (locale: Locale): void => {
    if (uiStore) {
      uiStore.locale = locale;
    }
  };

  return [locale, setLocale];
};
