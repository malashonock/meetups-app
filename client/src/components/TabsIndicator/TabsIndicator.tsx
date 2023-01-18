import React from 'react';

import styles from './TabsIndicator.module.scss';

interface TabsIndicatorProps {
  tabsCount: number;
  activeTabIndex: number;
}
export const TabsIndicator = ({
  tabsCount,
  activeTabIndex,
}: TabsIndicatorProps) => {
  return (
    <div
      className={styles.indicator}
      style={{
        '--tabsCount': tabsCount,
        '--activeTabIndex': activeTabIndex,
      } as React.CSSProperties}
    />
  );
};
