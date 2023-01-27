import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStore } from 'stores';
import { Nullable } from 'types';

export const RootContext = createContext<Nullable<RootStore>>(null);

export const RootStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    const [rootStore, setRootStore] = useState(
      (): RootStore => new RootStore(),
    );

    // Initialize root store
    useEffect((): void => {
      (async (): Promise<void> => {
        setRootStore(await rootStore.init());
      })();
    }, []);

    return (
      <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
    );
  },
);
