import React, { PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';

import { TabsContext, TabsContextType } from 'components';

import styles from './Tab.module.scss';

export interface TabProps {
  value: string;
}

export const Tab = ({ value, children }: PropsWithChildren<TabProps>) => {
  const { activeTabValue } = useContext(TabsContext) as TabsContextType;

  return (
    <div
      data-tab-value={value}
      className={classNames(styles.tab, {
        [styles.active]: activeTabValue === value,
      })}
    >
      {children}
    </div>
  );
};
