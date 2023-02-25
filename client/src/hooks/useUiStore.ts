import { useContext } from 'react';

import { UiStore } from 'stores';
import { RootContext } from 'components';

export interface UseUiStoreResult {
  uiStore?: UiStore;
}

export const useUiStore = (): UseUiStoreResult => {
  const uiStore = useContext(RootContext)?.uiStore;

  return {
    uiStore,
  };
};
