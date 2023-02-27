import { useContext } from 'react';

import { AuthStore, FullUser } from 'stores';
import { RootContext } from 'components';
import { Nullable } from 'types';

export interface UseAuthStoreResult {
  authStore?: AuthStore;
  isInitialized?: boolean;
  loggedUser?: Nullable<FullUser>;
}

export const useAuthStore = (): UseAuthStoreResult => {
  const authStore = useContext(RootContext)?.authStore;
  const isInitialized = authStore?.isInitialized;
  const loggedUser = authStore?.loggedUser;

  return {
    authStore,
    isInitialized,
    loggedUser,
  };
};
