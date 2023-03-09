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
  describe('given root context is not yet set up', () => {
    it('should return an object with undefined uiStore and alerts', () => {
      const { result } = renderHook(() => useUiStore());

      expect(result.current.uiStore).toBeUndefined();
      expect(result.current.alerts).toBeUndefined();
    });
  });

  describe('given root context is set up', () => {
    it('should return an object containing uiStore and alerts', () => {
      const { result } = renderHook(() => useUiStore(), {
        wrapper: MockRootStoreProvider,
      });

      expect(result.current.uiStore?.toJSON()).toStrictEqual(
        mockRootStore.uiStore.toJSON(),
      );
      expect(result.current.alerts).toStrictEqual(mockRootStore.uiStore.alerts);
    });
  });
});
