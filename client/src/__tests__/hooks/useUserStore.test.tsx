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
  it('should return the user store', () => {
    const { result } = renderHook(() => useUserStore(), {
      wrapper: MockRootStoreProvider,
    });

    expect(result.current.toJSON()).toStrictEqual(
      mockRootStore.authStore.userStore.toJSON(),
    );
  });
});
