import { createContext, PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStore } from 'stores';
import { useTranslation } from 'react-i18next';

const rootStore = new RootStore();
export const RootContext = createContext<RootStore>(rootStore);

export const RootStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    // Initialize root store
    useEffect((): void => {
      (async (): Promise<void> => {
        await rootStore.init();
      })();
    }, [rootStore]);

    // Set UI language
    const { i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(rootStore.uiStore.locale);
    }, [rootStore.uiStore.locale, i18n]);

    return (
      <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
    );
  },
);
