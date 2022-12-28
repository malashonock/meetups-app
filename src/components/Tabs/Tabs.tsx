import React, {
  Children,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import { TabsContext, TabsContextType } from 'components';

import styles from './Tabs.module.scss';

interface TabsProps {
  changesUrl: boolean;
  className?: string;
}

export function Tabs({
  changesUrl,
  className,
  children,
}: PropsWithChildren<TabsProps>) {
  const location = useLocation();
  const { activeTabValue, setActiveTabValue } = useContext(
    TabsContext,
  ) as TabsContextType;

  const arrayChildren = Children.toArray(children) as ReactElement[];

  const setIndicatorPosition = (index: number) => {
    document.documentElement.style.setProperty('--position', `${index}`);
  };

  /* Set state of active tab value (which is null at start) equal to first tab on initialization */
  useLayoutEffect(() => {
    setActiveTabValue(arrayChildren[0].props.value);
  }, []);

  /* Change indicator if tabs dont change url (tabs are not NavLinks) */
  useEffect(() => {
    if (!changesUrl) {
      const index = arrayChildren
        .map((child) => child.props.value)
        .indexOf(activeTabValue);

      setIndicatorPosition(index);
    }
  }, [activeTabValue]);

  /* Change indicator if tabs change url (tabs are NavLinks) */
  useEffect(() => {
    if (changesUrl) {
      const tabToOpen = location.pathname.split('/').slice(-1)[0];
      const indexOfTabToOpen = arrayChildren
        .map((child) => child.props.to)
        .indexOf(tabToOpen);

      setIndicatorPosition(indexOfTabToOpen !== -1 ? indexOfTabToOpen : 0);
    }
  }, [location]);

  const handleClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    setActiveTabValue(e.target.dataset.tabValue as string);
  };

  return (
    <>
      <div
        className={classNames(styles.tabs, className)}
        onClick={(e) => {
          if (!changesUrl) handleClick(e);
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
