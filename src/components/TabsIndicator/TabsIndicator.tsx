import React from 'react';

import styles from './TabsIndicator.module.scss';

interface TabsIndicatorProps {
  tabsAmount: number;
  currentTab: number;
}
export const TabsIndicator = ({
  tabsAmount,
  currentTab,
}: TabsIndicatorProps) => {
  return (
    <div
      className={styles.indicator}
      style={
        {
          '--numOfTabs': tabsAmount,
          '--position': currentTab,
        } as React.CSSProperties
      }
    />
  );
};
