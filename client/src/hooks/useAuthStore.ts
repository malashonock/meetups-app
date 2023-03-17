import { useContext } from 'react';

import { AuthStore } from 'stores';
import { RootContext } from 'components';

export const useAuthStore = (): AuthStore => {
  return useContext(RootContext).authStore;
};
