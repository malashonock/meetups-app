import { useContext } from 'react';

import { UiStore } from 'stores';
import { RootContext } from 'components';
import { Alert } from 'types';

export interface UseUiStoreResult {
  uiStore?: UiStore;
  alerts?: Alert[];
}

export const useUiStore = (): UseUiStoreResult => {
  const uiStore = useContext(RootContext)?.uiStore;
  const alerts = uiStore?.alerts;

  return {
    uiStore,
    alerts,
  };
};
