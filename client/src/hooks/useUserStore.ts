import { useContext } from 'react';

import { UserStore } from 'stores';
import { RootContext } from 'components';

export const useUserStore = (): UserStore => {
  return useContext(RootContext).authStore.userStore;
};
