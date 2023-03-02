import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { RootStore } from 'stores';
import { Alert, AlertSeverity, Optional } from 'types';
import { useTranslation } from 'react-i18next';

export const RootContext = createContext<Optional<RootStore>>(undefined);

export const RootStoreProvider = observer(
  ({ children }: PropsWithChildren): JSX.Element => {
    const [rootStore] = useState((): RootStore => new RootStore());

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
      rootStore.onAlert(
        new Alert(
          {
            severity: AlertSeverity.Success,
            text: i18n.t('alerts.localeChanged'),
          },
          rootStore.uiStore,
        ),
      );
    }, [rootStore.uiStore.locale, i18n]);

    return (
      <RootContext.Provider value={rootStore}>{children}</RootContext.Provider>
    );
  },
);
