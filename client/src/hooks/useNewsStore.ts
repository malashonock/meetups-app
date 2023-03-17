import { useContext, useEffect } from 'react';

import { NewsStore } from 'stores';
import { RootContext } from 'components';

export const useNewsStore = (): NewsStore => {
  const newsStore = useContext(RootContext).newsStore;

  // Hydrate news store on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      await newsStore.loadNews();
    })();
  }, [newsStore]);

  return newsStore;
};
