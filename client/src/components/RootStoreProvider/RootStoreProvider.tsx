import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStore } from 'stores';
import { Nullable } from 'types';
import { useTranslation } from 'react-i18next';

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

    // Set UI language
    const { i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(rootStore.uiStore.locale);
    }, [rootStore.uiStore.locale]);

    return (
      <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
    );
  },
);
