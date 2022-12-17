import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src={logo} alt="Логотип" height={'45px'} />
        <nav className={styles.nav}>
          <NavLink to="/meetups" className={styles['nav-link']}>
            Митапы
          </NavLink>
          <NavLink to="/news" className={styles['nav-link']}>
            Новости
          </NavLink>
        </nav>
        <div className={styles.user}>
          <span className={styles['user-name']}>Nikolai Borisik</span>
          <div className={styles['user-photo']}>NB</div>
        </div>
      </div>
    </header>
  );
};
