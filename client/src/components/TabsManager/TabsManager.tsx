import React, { Dispatch, SetStateAction, useState } from 'react';

import { Tabs, TabContent, Tab } from 'components';

export type TabsContextType = {
  activeTabValue: string | null;
  setActiveTabValue: Dispatch<SetStateAction<string | null>>;
};

export const TabsContext = React.createContext<TabsContextType | null>(null);

interface Tab {
  title: string;
  element: JSX.Element;
}

interface TabsManagerProps {
  tabs: Tab[];
}

export const TabsManager = ({ tabs }: TabsManagerProps) => {
  const [activeTabValue, setActiveTabValue] = useState<string | null>(null);

  return (
    <TabsContext.Provider value={{ activeTabValue, setActiveTabValue }}>
      <Tabs>
        {tabs.map(
          (tab: Tab, index: number): JSX.Element => (
            <Tab value={`${index}`} key={tab.title}>
              {tab.title}
            </Tab>
          ),
        )}
      </Tabs>
      {tabs.map(
        (tab: Tab, index: number): JSX.Element => (
          <TabContent key={index} value={`${index}`}>
            {tab.element}
          </TabContent>
        ),
      )}
    </TabsContext.Provider>
  );
};
