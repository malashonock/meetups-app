import { renderHook } from '@testing-library/react';

import { useUser } from 'hooks';
import { useUserStore } from 'hooks/useUserStore';
import { RootStore } from 'stores';
import { mockFullUser } from 'model/__fakes__';

const mockRootStore = new RootStore();
const spiedOnUserStoreFindUser = jest.spyOn(
  mockRootStore.authStore.userStore,
  'findUser',
);

// Mock useUserStore hook
jest.mock('hooks/useUserStore', () => {
  return {
    useUserStore: jest.fn(),
  };
});
const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;

beforeEach(() => {
  mockUseUserStore.mockReturnValue({
    userStore: mockRootStore.authStore.userStore,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useUser hook', () => {
  describe('given id arg is provided', () => {
    describe('given useUserStore() hook returns an undefined userStore', () => {
      it('should return undefined', () => {
        mockUseUserStore.mockReturnValue({
          userStore: undefined,
        });
        const { result } = renderHook(() => useUser(mockFullUser.id));
        expect(result.current).toBeUndefined();
      });
    });

    describe('given useUserStore() hook returns an initialized UserStore instance', () => {
      it('should return the user with the specified id', () => {
        spiedOnUserStoreFindUser.mockReturnValue(mockFullUser);
        const { result } = renderHook(() => useUser(mockFullUser.id));
        expect(result.current).toBe(mockFullUser);
      });
    });
  });

  describe('given id arg is not provided', () => {
    it('should return undefined', () => {
      const { result } = renderHook(() => useUser(undefined));
      expect(result.current).toBeUndefined();
    });
  });
});
