import { useContext } from 'react';

import { AuthStore, User } from 'stores';
import { RootContext } from 'components';
import { Nullable } from 'types';

export interface UseAuthStoreResult {
  authStore?: AuthStore;
  loggedUser?: Nullable<User>;
}

export const useAuthStore = (): UseAuthStoreResult => {
  const authStore = useContext(RootContext)?.authStore;
  const loggedUser = authStore?.loggedUser;

  return {
    authStore,
    loggedUser,
  };
};
