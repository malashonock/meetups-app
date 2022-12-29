import React, {
  Children,
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import classNames from 'classnames';

import { Tab, TabsContext, TabsContextType } from 'components';

import styles from './Tabs.module.scss';

interface TabsProps {
  className?: string;
  children: Array<ReactElement<typeof Tab>>;
}

export function Tabs({ className, children }: TabsProps) {
  const { activeTabValue, setActiveTabValue } = useContext(
    TabsContext,
  ) as TabsContextType;

  const arrayChildren = Children.toArray(children) as ReactElement[];

  const setIndicatorPosition = (index: number) => {
    document.documentElement.style.setProperty('--position', `${index}`);
  };

  const handleClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    setActiveTabValue(e.target.dataset.tabValue as string);
  };

  /* Set state of active tab value (which is null at start) equal to first tab on initialization */
  useLayoutEffect(() => {
    setActiveTabValue(arrayChildren[0].props.value);
  }, []);

  useEffect(() => {
    const index = arrayChildren
      .map((child) => child.props.value)
      .indexOf(activeTabValue);

    setIndicatorPosition(index);
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
      <div
        className={styles['tab-indicator']}
        style={{ '--numOfTabs': arrayChildren.length } as React.CSSProperties}
      />
    </>
  );
}
