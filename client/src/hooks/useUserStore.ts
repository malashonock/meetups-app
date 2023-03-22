import { useContext } from 'react';

import { User, UserStore } from 'stores';
import { RootContext } from 'components';
import { Optional } from 'types';

export interface UseUserStoreResult {
  userStore?: UserStore;
  users?: User[];
  findUser?: (id: string) => Optional<User>;
  findUsers?: (ids: string[]) => User[];
}

export const useUserStore = (): UseUserStoreResult => {
  const userStore = useContext(RootContext)?.authStore?.userStore;
  const users = userStore?.users;
  const findUser = userStore?.findUser;
  const findUsers = userStore?.findUsers;

  return {
    userStore,
    users,
    findUser,
    findUsers,
  };
};
