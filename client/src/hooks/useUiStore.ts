import { useContext } from 'react';

import { UiStore } from 'stores';
import { RootContext } from 'components';

export const useUiStore = (): UiStore => {
  return useContext(RootContext).uiStore;
};
