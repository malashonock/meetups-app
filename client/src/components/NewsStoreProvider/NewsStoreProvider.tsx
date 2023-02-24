import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

import { NewsStore } from 'stores';
import { Optional } from 'types';

export const NewsContext = createContext<Optional<NewsStore>>(undefined);

export const NewsStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    const [newsStore] = useState((): NewsStore => new NewsStore());

    // Hydrate news store
    useEffect((): void => {
      (async (): Promise<void> => {
        await newsStore.loadNews();
      })();
    }, [newsStore]);

    return (
      <NewsContext.Provider value={newsStore}>
        <Outlet />
      </NewsContext.Provider>
    );
  },
);
