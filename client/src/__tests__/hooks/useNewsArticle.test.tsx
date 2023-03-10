import { renderHook } from '@testing-library/react';

import { useNewsArticle } from 'hooks';
import { useNewsStore } from 'hooks/useNewsStore';
import { NotFoundError } from 'model';
import { mockNewsArticle } from 'model/__fakes__';
import { RootStore } from 'stores';

const mockRootStore = new RootStore();
mockRootStore.newsStore.isInitialized = true;
const spiedOnNewsStoreFindNewsArticle = jest.spyOn(
  mockRootStore.newsStore,
  'findNewsArticle',
);

// Mock useNewsStore hook
jest.mock('hooks/useNewsStore', () => {
  return {
    useNewsStore: jest.fn(),
  };
});
const mockUseNewsStore = useNewsStore as jest.MockedFunction<
  typeof useNewsStore
>;

beforeEach(() => {
  mockUseNewsStore.mockReturnValue({
    newsStore: mockRootStore.newsStore,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useNewsArticle hook', () => {
  describe('given id arg is provided', () => {
    describe('given useNewsStore() hook returns an undefined newsStore', () => {
      it('should return undefined', () => {
        mockUseNewsStore.mockReturnValue({
          newsStore: undefined,
        });

        const { result } = renderHook(() => useNewsArticle(mockNewsArticle.id));

        expect(result.current.newsArticle).toBeUndefined();
        expect(result.current.isLoading).toBeUndefined();
        expect(result.current.isError).toBeUndefined();
        expect(result.current.errors).toBeUndefined();
      });
    });

    describe('given useNewsStore() hook returns an initialized NewsStore instance', () => {
      it('should return the news article with the specified id', () => {
        spiedOnNewsStoreFindNewsArticle.mockReturnValue(mockNewsArticle);

        const { result } = renderHook(() => useNewsArticle(mockNewsArticle.id));

        expect(result.current.newsArticle).toStrictEqual(mockNewsArticle);
        expect(result.current.isLoading).toBe(mockNewsArticle.isLoading);
        expect(result.current.isError).toBe(mockNewsArticle.isError);
        expect(result.current.errors).toStrictEqual(mockNewsArticle.errors);
      });
    });
  });

  describe('given id arg is not provided', () => {
    it('should return undefined news article', () => {
      const { result } = renderHook(() => useNewsArticle(undefined));
      expect(result.current.newsArticle).toBeUndefined();
    });

    it('should return isLoading state of the news store', () => {
      const { result } = renderHook(() => useNewsArticle(undefined));
      expect(result.current.isLoading).toBe(mockRootStore.newsStore.isLoading);
    });

    describe('given news store is initialized', () => {
      it('should push a new Not Found error to errors', () => {
        const { result } = renderHook(() => useNewsArticle(undefined));
        expect(result.current.isError).toBe(true);
        expect(result.current.errors?.length).toBe(1);
        expect(result.current.errors![0] instanceof NotFoundError).toBe(true);
      });
    });

    describe('given news store is undefined or uninitialized', () => {
      it('should return undefined isError and errors', () => {
        mockUseNewsStore.mockReturnValue({
          newsStore: new RootStore().newsStore,
        });

        const { result } = renderHook(() => useNewsArticle(undefined));
        expect(result.current.isError).toBeUndefined();
        expect(result.current.errors).toBeUndefined();
      });
    });
  });
});
