import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import classNames from 'classnames';

import {
  TabProps,
  TabsContext,
  TabsContextType,
  TabsIndicator,
} from 'components';

import styles from './Tabs.module.scss';

interface TabsProps {
  className?: string;
}

export function Tabs({ className, children }: PropsWithChildren<TabsProps>) {
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

  useLayoutEffect(() => {
    setActiveTabValue(arrayChildren[0].props.value);
  }, []);

  useLayoutEffect(() => {
    const index = arrayChildren
      .map((child) => child.props.value)
      .indexOf(activeTabValue!);

    setIndicatorPosition(index + 1);
  }, [activeTabValue]);

  return (
    <>
      <div
        className={classNames(styles.tabs, className)}
        onClick={(e) => {
          handleClick(e);
        }}
      >
        {children}
      </div>
      <TabsIndicator
        tabsAmount={arrayChildren.length}
        currentTab={indicatorPosition - 1}
      />
    </>
  );
}
