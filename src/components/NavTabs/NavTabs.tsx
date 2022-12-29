import React, { Children, ReactElement, useEffect } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './NavTabs.module.scss';

interface NavTabsProps {
  className?: string;
  children: Array<ReactElement<typeof NavLink>>;
}

export const NavTabs = ({ className, children }: NavTabsProps) => {
  const location = useLocation();

  const arrayChildren = Children.toArray(children) as ReactElement[];

  const setIndicatorPosition = (index: number) => {
    document.documentElement.style.setProperty('--position', `${index}`);
  };

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

    document.documentElement.style.setProperty(
      '--position',
      `${indexOfTabToOpen !== -1 ? indexOfTabToOpen : 0}`,
    );
  });

  return (
    <>
      <div className={classNames(styles.tabs, className)}>
        {childrenWithOnClickFunction}
      </div>
      <div
        className={styles['tab-indicator']}
        style={{ '--numOfTabs': arrayChildren.length } as React.CSSProperties}
      />
    </>
  );
};
