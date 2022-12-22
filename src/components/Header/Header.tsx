import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { Typography, UserPreview } from 'components';
import { ShortUser } from 'model';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';

const user: ShortUser = {
  id: 'AAA-AAA',
  name: 'Albert',
  surname: 'Richards',
};

export const Header = (): JSX.Element => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? classNames(styles['nav-link'], styles['active'])
      : styles['nav-link'];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src={logo} alt="Логотип" height={'45px'} />
        <nav className={styles.nav}>
          <NavLink to="/meetups" className={getLinkClassName}>
            <Typography>Митапы</Typography>
          </NavLink>
          <NavLink to="/news" className={getLinkClassName}>
            <Typography>Новости</Typography>
          </NavLink>
        </nav>
        <UserPreview variant="header" user={user} />
      </div>
    </header>
  );
};
