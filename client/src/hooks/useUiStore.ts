import { useContext } from 'react';

import { UiStore } from 'stores';
import { RootContext } from 'components';

export interface UseUiStoreResult {
  uiStore?: UiStore;
  locale?: string;
}

export const useUiStore = (): UseUiStoreResult => {
  const uiStore = useContext(RootContext)?.uiStore;
  const locale = uiStore?.locale;

  return {
    uiStore,
    locale,
  };
};
