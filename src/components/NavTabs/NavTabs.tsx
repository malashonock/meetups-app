import React, {
  Children,
  HTMLAttributes,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import { TabsIndicator } from 'components';

import styles from './NavTabs.module.scss';

interface NavTabsProps extends HTMLAttributes<HTMLElement> {
  children: Array<ReactElement<typeof NavLink>>;
}

export const NavTabs = ({ className, children }: NavTabsProps) => {
  const location = useLocation();
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const arrayChildren = Children.toArray(children) as ReactElement[];

  const childrenWithOnClickFunction = React.Children.map(
    children,
    (child, index) => {
      return React.cloneElement(child as ReactElement, {
        onClick: () => setIndicatorPosition(index),
      });
    },
  );

  /* Chooses which tab is active on initialization */
  useEffect(() => {
    const tabToOpen = location.pathname.split('/').slice(-1)[0];
    const indexOfTabToOpen = arrayChildren
      .map((child) => child.props.to)
      .indexOf(tabToOpen);

    setIndicatorPosition(indexOfTabToOpen !== -1 ? indexOfTabToOpen : 0);
  });

  return (
    <>
      <div className={classNames(styles.tabs, className)}>
        {childrenWithOnClickFunction}
      </div>
      <TabsIndicator
        tabsAmount={arrayChildren.length}
        currentTab={indicatorPosition}
      />
    </>
  );
};
