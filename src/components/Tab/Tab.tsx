import React, { PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';

import { TabsContext, TabsContextType } from 'components';

export interface TabProps {
  value: string;
  className?: string;
  classNameActive?: string;
}

export const Tab = ({
  value,
  className = '',
  classNameActive = '',
  children,
}: PropsWithChildren<TabProps>) => {
  const { activeTabValue } = useContext(TabsContext) as TabsContextType;

  return (
    <div
      data-tab-value={value}
      className={classNames(className, {
        [classNameActive]: activeTabValue === value,
      })}
    >
      {children}
    </div>
  );
};
