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
  mockUseNewsStore.mockReturnValue(mockRootStore.newsStore);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useNewsArticle hook', () => {
  describe('given the id of an existing news article is provided', () => {
    it('should return the news article with the specified id', () => {
      spiedOnNewsStoreFindNewsArticle.mockReturnValue(mockNewsArticle);
      const { result } = renderHook(() => useNewsArticle(mockNewsArticle.id));
      expect(result.current).toStrictEqual(mockNewsArticle);
    });
  });

  describe('given the id of a non-existing news article is provided', () => {
    it('should return undefined', () => {
      spiedOnNewsStoreFindNewsArticle.mockReturnValue(undefined);
      const { result } = renderHook(() => useNewsArticle(mockNewsArticle.id));
      expect(result.current).toBeUndefined();
    });
  });

  describe('given id arg is not provided', () => {
    it('should return undefined', () => {
      const { result } = renderHook(() => useNewsArticle(undefined));
      expect(result.current).toBeUndefined();
    });
  });
});
