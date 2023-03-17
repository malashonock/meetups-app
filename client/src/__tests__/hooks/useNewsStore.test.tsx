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

const spiedOnApiGetNews = jest.spyOn(NewsApi, 'getNews');

beforeEach(() => {
  spiedOnApiGetNews.mockResolvedValue(mockNewsData);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('useNewsStore hook', () => {
  it('should return the news store', async () => {
    const { result, rerender } = renderHook(() => useNewsStore(), {
      wrapper: MockRootStoreProvider,
    });

    // loadNews is run async, need to wait for next update
    rerender();

    expect(result.current.toJSON()).toStrictEqual(
      mockRootStore.newsStore.toJSON(),
    );
  });
});
