import { User } from 'stores';
import { Maybe, Optional } from 'types';
import { useUserStore } from './useUserStore';

export const useUser = (
  idOrString: Maybe<string | { id: string }>,
): Optional<User> => {
  const { userStore } = useUserStore();

  if (!idOrString) {
    return undefined;
  }

  const user = userStore?.findUser(idOrString);

  return user;
};
