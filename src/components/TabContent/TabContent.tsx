import React, { PropsWithChildren, useContext } from 'react';

import { TabsContext, TabsContextType } from 'components';

interface TabContentProps {
  value: string;
}

export const TabContent = ({
  value,
  children,
}: PropsWithChildren<TabContentProps>) => {
  const { activeTabValue } = useContext(TabsContext) as TabsContextType;

  return (
    <div style={{ display: activeTabValue === value ? 'block' : 'none' }}>
      {children}
    </div>
  );
};
