import React, { Dispatch, SetStateAction, useState } from 'react';

import { Tabs, TabPanel, Tab } from 'components';

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
        {tabs
          .map((tab) => tab.title)
          .map((title, index) => (
            <Tab value={`${index}`} key={title}>
              {title}
            </Tab>
          ))}
      </Tabs>
      {tabs
        .map((tab) => tab.element)
        .map((element, index) => (
          <TabPanel key={index} value={`${index}`}>
            {element}
          </TabPanel>
        ))}
    </TabsContext.Provider>
  );
};
