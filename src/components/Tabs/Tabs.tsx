import React, { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './Tabs.module.scss';

interface RenderTabCallbackParams<T> {
  tab: T;
  onSetActiveTab: () => void;
}

export type RenderTabCallback<T> = (
  params: RenderTabCallbackParams<T>,
) => React.ReactNode;

interface TabsProps<T> {
  tabs: T[];
  renderTab: RenderTabCallback<T>;
  usesUrl?: boolean;
}

export function Tabs<T>({
  tabs,
  renderTab,
  usesUrl,
  children,
}: PropsWithChildren<TabsProps<T>>) {
  const location = useLocation();

  useEffect(() => {
    if (usesUrl) {
      const tabToOpen = location.pathname.split('/').slice(-1)[0] as T;
      const indexOfTabToOpen = tabs.indexOf(tabToOpen);

      document.documentElement.style.setProperty(
        '--position',
        `${indexOfTabToOpen !== -1 ? indexOfTabToOpen : 0}`,
      );
    } else {
      document.documentElement.style.setProperty('--position', '0');
    }
  });

  const setIndicatorPosition = (index: number) => {
    document.documentElement.style.setProperty('--position', `${index}`);
  };

  return (
    <>
      <div className={styles.tabs}>
        {tabs.map((tab, index) =>
          renderTab({
            tab,
            onSetActiveTab: () => setIndicatorPosition(index),
          }),
        )}
      </div>
      <div
        className={styles['tab-indicator']}
        style={{ '--numOfTabs': tabs.length } as React.CSSProperties}
      />
      <div className={styles['tabs-content']}>{children}</div>
    </>
  );
}
