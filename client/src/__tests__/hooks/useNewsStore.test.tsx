import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

import { useNewsStore } from 'hooks';
import { RootStore } from 'stores';
import { RootContext } from 'components';
import * as NewsApi from 'api/services/news.service';
import { mockNewsData } from 'model/__fakes__';

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

const spiedOnApiLoadNews = jest.spyOn(NewsApi, 'getNews');

beforeEach(() => {
  spiedOnApiLoadNews.mockResolvedValue(mockNewsData);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useNewsStore hook', () => {
  describe('given root context is not yet set up', () => {
    it('should return an object with undefined properties', () => {
      const { result } = renderHook(() => useNewsStore());

      expect(result.current.newsStore).toBeUndefined();
      expect(result.current.news).toBeUndefined();
      expect(result.current.isLoading).toBeUndefined();
      expect(result.current.isError).toBeUndefined();
      expect(result.current.errors).toBeUndefined();
      expect(result.current.createNewsArticle).toBeUndefined();
      expect(result.current.findNewsArticle).toBeUndefined();
    });
  });

  describe('given root context is set up', () => {
    it('should return an object containing correctly initialized properties', async () => {
      const { result, rerender } = renderHook(() => useNewsStore(), {
        wrapper: MockRootStoreProvider,
      });

      // loadNews is run async, need to wait for next update
      rerender();

      expect(result.current.newsStore?.toJSON()).toStrictEqual(
        mockRootStore.newsStore.toJSON(),
      );
      expect(result.current.news).toStrictEqual(mockRootStore.newsStore.news);
      expect(result.current.isLoading).toBe(mockRootStore.newsStore.isLoading);
      expect(result.current.isError).toBe(mockRootStore.newsStore.isError);
      expect(result.current.errors).toStrictEqual(
        mockRootStore.newsStore.errors,
      );
      expect(result.current.createNewsArticle).toBe(
        mockRootStore.newsStore.createNewsArticle,
      );
      expect(result.current.findNewsArticle).toBe(
        mockRootStore.newsStore.findNewsArticle,
      );
    });
  });
});
