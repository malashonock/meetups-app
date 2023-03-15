import { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import {
  AuthToggle,
  BurgerButton,
  BurgerMenu,
  LanguageSelect,
  PageLink,
  TooltipPosition,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { useAuthStore } from 'hooks';
import { Theme } from 'types';

import styles from './Header.module.scss';
import logo from 'assets/images/logo.svg';

export const Header = observer((): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { t } = useTranslation();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link to="/">
            <img
              src={logo}
              className={styles.logo}
              alt={t('logoAlt') || 'Logo'}
            />
          </Link>
          {loggedUser ? (
            <div className={styles.languageSelect}>
              <LanguageSelect />
            </div>
          ) : null}
        </div>
        <nav className={styles.nav}>
          <PageLink url="/meetups" theme={Theme.Dark}>
            {t('meetups')}
          </PageLink>
          <PageLink url="/news" theme={Theme.Dark}>
            {t('news')}
          </PageLink>
        </nav>
        <div className={styles.userInfo}>
          {loggedUser ? (
            <UserPreview
              variant={UserPreviewVariant.Header}
              user={loggedUser}
            />
          ) : (
            <div className={styles.languageSelect}>
              <LanguageSelect />
            </div>
          )}
          <AuthToggle tooltipPosition={TooltipPosition.BottomRight} />
        </div>
        <div className={styles.burger}>
          <BurgerButton
            isOpen={isOffcanvasOpen}
            setIsOpen={setIsOffcanvasOpen}
          />
        </div>
      </div>
      <BurgerMenu isOpen={isOffcanvasOpen} />
    </header>
  );
});
