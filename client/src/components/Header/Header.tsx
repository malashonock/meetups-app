import { Link, NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import {
  AuthToggle,
  LanguageSelect,
  Typography,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { useAuthStore } from 'hooks';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';

export const Header = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <div className={styles.logoWrapper}>
            <Link to="/">
              <img
                src={logo}
                className={styles.logo}
                alt={t('logoAlt') || 'Logo'}
              />
            </Link>
            {loggedUser ? <LanguageSelect /> : null}
          </div>
          <nav className={classNames(styles.nav, styles.hiddenOnSmall)}>
            <NavLink
              to="/meetups"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>{t('meetups')}</Typography>
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>{t('news')}</Typography>
            </NavLink>
          </nav>
          <div className={styles.userInfo}>
            {loggedUser ? (
              <UserPreview
                variant={UserPreviewVariant.Header}
                user={loggedUser}
              />
            ) : (
              <LanguageSelect />
            )}
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
              <Typography>{t('meetups')}</Typography>
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                classNames(styles.navLink, {
                  [styles.active]: isActive,
                })
              }
            >
              <Typography>{t('news')}</Typography>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
});
