import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';
import { UserPreview } from 'components/UserPreview/UserPreview';

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
            Митапы
          </NavLink>
          <NavLink to="/news" className={getLinkClassName}>
            Новости
          </NavLink>
        </nav>
        <UserPreview name="Nikolai Borisik" />
      </div>
    </header>
  );
};
