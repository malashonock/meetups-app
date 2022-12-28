import React, { PropsWithChildren, useState } from 'react';

export type TabsContextType = {
  activeTabValue: string | null;
  setActiveTabValue: (value: string) => void;
};

export const TabsContext = React.createContext<TabsContextType | null>(null);

export const TabsManager = ({ children }: PropsWithChildren) => {
  const [activeTabValue, setActiveTabValue] = useState<string | null>(null);

  return (
    <TabsContext.Provider value={{ activeTabValue, setActiveTabValue }}>
      {children}
    </TabsContext.Provider>
  );
};
