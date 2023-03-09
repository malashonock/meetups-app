import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import { useUserStore } from 'hooks';
import { RootStore } from 'stores';
import { RootContext } from 'components';

const mockRootStore = new RootStore();

const MockRootStoreProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  return (
    <RootContext.Provider value={mockRootStore}>
      {children}
    </RootContext.Provider>
  );
};

describe('useUserStore hook', () => {
  describe('given root context is not yet set up', () => {
    it('should return an object with undefined properties', () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.userStore).toBeUndefined();
      expect(result.current.users).toBeUndefined();
      expect(result.current.findUser).toBeUndefined();
      expect(result.current.findUsers).toBeUndefined();
    });
  });

  describe('given root context is set up', () => {
    it('should return an object containing correctly initialized properties', () => {
      const { result } = renderHook(() => useUserStore(), {
        wrapper: MockRootStoreProvider,
      });

      expect(result.current.userStore?.toJSON()).toStrictEqual(
        mockRootStore.authStore.userStore.toJSON(),
      );
      expect(result.current.users).toStrictEqual(
        mockRootStore.authStore.userStore.users,
      );
      expect(result.current.findUser).toBe(
        mockRootStore.authStore.userStore.findUser,
      );
      expect(result.current.findUsers).toBe(
        mockRootStore.authStore.userStore.findUsers,
      );
    });
  });
});
