import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import {
  TabProps,
  TabsContext,
  TabsContextType,
  TabsIndicator,
} from 'components';

import styles from './Tabs.module.scss';

export function Tabs({ children }: PropsWithChildren) {
  const { activeTabValue, setActiveTabValue } = useContext(
    TabsContext,
  ) as TabsContextType;

  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const arrayChildren = Children.toArray(children) as ReactElement<TabProps>[];

  const handleClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    setActiveTabValue(e.target.dataset.tabValue as string);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect(() => {
    setActiveTabValue(arrayChildren[0].props.value);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useLayoutEffect(() => {
    const index = arrayChildren.findIndex(
      (child: ReactElement<TabProps>): boolean =>
        child.props.value === activeTabValue,
    );

    setIndicatorPosition(index + 1);
  }, [activeTabValue]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <div
        className={styles.tabs}
        onClick={(e) => {
          handleClick(e);
        }}
      >
        {children}
      </div>
      <TabsIndicator
        tabsCount={arrayChildren.length}
        activeTabIndex={indicatorPosition - 1}
      />
    </>
  );
}
