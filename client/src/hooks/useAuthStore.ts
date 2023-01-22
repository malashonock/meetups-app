import { useContext } from 'react';

import { RootContext } from 'App';
import { User } from 'model';
import { AuthStore } from 'stores';
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
