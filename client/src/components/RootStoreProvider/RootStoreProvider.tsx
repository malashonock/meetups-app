import { createContext, PropsWithChildren, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStore } from 'stores';
import { useTranslation } from 'react-i18next';

const rootStore = new RootStore();
export const RootContext = createContext<RootStore>(rootStore);

export const RootStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    // Initialize root store
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect((): void => {
      (async (): Promise<void> => {
        await rootStore.init();
      })();
    }, [rootStore]);
    /* eslint-enable react-hooks/exhaustive-deps */

    // Set UI language
    const { i18n } = useTranslation();
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      i18n.changeLanguage(rootStore.uiStore.locale);
    }, [rootStore.uiStore.locale, i18n]);
    /* eslint-enable react-hooks/exhaustive-deps */

    return (
      <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
    );
  },
);
