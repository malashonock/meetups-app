import React, { Children, HTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import { TabsIndicator } from 'components';

import styles from './NavTabs.module.scss';

interface NavTabsProps extends HTMLAttributes<HTMLElement> {
  children: Array<ReactElement<typeof NavLink>>;
}

export const NavTabs = ({ className, children }: NavTabsProps) => {
  const location = useLocation();

  const arrayChildren = Children.toArray(children) as ReactElement[];

  const tabToOpen = location.pathname.split('/').slice(-1)[0];
  const indexOfTabToOpen = arrayChildren
    .map((child) => child.props.to)
    .indexOf(tabToOpen);

  return (
    <>
      <div className={classNames(styles.tabs, className)}>{children}</div>
      <TabsIndicator
        tabsAmount={arrayChildren.length}
        currentTab={indexOfTabToOpen !== -1 ? indexOfTabToOpen : 0}
      />
    </>
  );
};
