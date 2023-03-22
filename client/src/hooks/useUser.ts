import { User } from 'stores';
import { Maybe, Optional } from 'types';
import { useUserStore } from 'hooks';

export const useUser = (
  idOrString: Maybe<string | { id: string }>,
): Optional<User> => {
  const userStore = useUserStore();
  return idOrString ? userStore.findUser(idOrString) : undefined;
};
