import React, { PropsWithChildren, useContext } from 'react';

import { TabsContext, TabsContextType } from 'components';

import styles from './TabContent.module.scss';

interface TabContentProps {
  value: string;
}

export const TabContent = ({
  value,
  children,
}: PropsWithChildren<TabContentProps>) => {
  const { activeTabValue } = useContext(TabsContext) as TabsContextType;

  return (
    <div className={activeTabValue === value ? styles.visible : styles.hidden}>
      {children}
    </div>
  );
};
