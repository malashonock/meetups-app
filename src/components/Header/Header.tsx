import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { Typography, UserPreview, UserPreviewVariant } from 'components';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';
import { ShortUser } from 'model';

const user: ShortUser = {
  id: 'AAA-AAA',
  name: 'Albert',
  surname: 'Richards',
};

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src={logo} alt="Логотип" height={'45px'} />
        <nav className={styles.nav}>
          <NavLink
            to="/meetups"
            className={({ isActive }) =>
              classNames(styles['nav-link'], {
                [styles['active']]: isActive,
              })
            }
          >
            <Typography>Митапы</Typography>
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              classNames(styles['nav-link'], {
                [styles['active']]: isActive,
              })
            }
          >
            <Typography>Новости</Typography>
          </NavLink>
        </nav>
        <UserPreview variant={UserPreviewVariant.Header} user={user} />
      </div>
    </header>
  );
};
