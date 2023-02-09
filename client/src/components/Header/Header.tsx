import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import {
  AuthToggle,
  Typography,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { useAuthStore } from 'hooks';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';

export const Header = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <img src={logo} className={styles.logo} alt="Логотип" />
          <nav className={classNames(styles.nav, styles.hiddenOnSmall)}>
            <NavLink
              to="/meetups"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>Митапы</Typography>
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>Новости</Typography>
            </NavLink>
          </nav>
          <div className={styles.auth}>
            {loggedUser ? (
              <UserPreview
                variant={UserPreviewVariant.Header}
                user={loggedUser}
              />
            ) : null}
            <AuthToggle />
          </div>
        </div>

        <div className={styles.navAdaptiveWrapper}>
          <nav className={styles.nav}>
            <NavLink
              to="/meetups"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>Митапы</Typography>
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>Новости</Typography>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
});
