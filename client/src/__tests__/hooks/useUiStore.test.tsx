import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import { useUiStore } from 'hooks';
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

describe('useUiStore hook', () => {
  it('should return the UI store', () => {
    const { result } = renderHook(() => useUiStore(), {
      wrapper: MockRootStoreProvider,
    });

    expect(result.current.toJSON()).toStrictEqual(
      mockRootStore.uiStore.toJSON(),
    );
  });
});
