import { User } from 'stores';
import { Maybe, Optional } from 'types';
import { useUserStore } from './useUserStore';

export const useUser = (id: Maybe<string>): Optional<User> => {
  const { userStore } = useUserStore();

  if (!id) {
    return undefined;
  }

  const user = userStore?.findUser(id);

  return user;
};
