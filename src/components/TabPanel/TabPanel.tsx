import React, { PropsWithChildren, useContext } from 'react';

import { TabsContext, TabsContextType } from 'components';

interface TabPanelProps {
  value: string;
  className?: string;
}

export const TabPanel = ({
  value,
  className = '',
  children,
}: PropsWithChildren<TabPanelProps>) => {
  const { activeTabValue } = useContext(TabsContext) as TabsContextType;

  return (
    <div
      style={{ display: activeTabValue === value ? 'block' : 'none' }}
      className={className}
    >
      {children}
    </div>
  );
};
