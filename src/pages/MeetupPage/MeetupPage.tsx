import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import classNames from 'classnames';

import { Typography } from 'components';

import styles from './MeetupPage.module.scss';

export const MeetupPage = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? classNames(styles.tab, styles.active) : styles.tab;

  return (
    <div>
      <Typography variant="h1--f1">Митапы</Typography>

      <div className="tabs">
        <NavLink to={'t1'} className={getLinkClassName}>
          Tab 1
        </NavLink>
        <NavLink to={'t2'} className={getLinkClassName}>
          Tab 2
        </NavLink>
        <NavLink to={'t3'} className={getLinkClassName}>
          Tab 3
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};
