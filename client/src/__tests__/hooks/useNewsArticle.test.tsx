import { renderHook } from '@testing-library/react';

import { useNewsArticle } from 'hooks';
import { useNewsStore } from 'hooks/useNewsStore';
import { mockNewsArticle } from 'model/__fakes__';
import { RootStore } from 'stores';

const mockRootStore = new RootStore();
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
    it('should return undefined', () => {
      const { result } = renderHook(() => useNewsArticle(undefined));

      expect(result.current.newsArticle).toBeUndefined();
      expect(result.current.isLoading).toBeUndefined();
      expect(result.current.isError).toBeUndefined();
      expect(result.current.errors).toBeUndefined();
    });
  });
});
