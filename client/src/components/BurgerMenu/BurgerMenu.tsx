import { useTranslation } from 'react-i18next';

import {
  AuthToggle,
  LanguageSelect,
  Offcanvas,
  PageLink,
  TooltipPosition,
  UserPreview,
  UserPreviewVariant,
} from 'components';
import { useAuthStore } from 'hooks';

import styles from './BurgerMenu.module.scss';
import { Theme } from 'types';

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const BurgerMenu = ({
  isOpen,
  setIsOpen,
}: BurgerMenuProps): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { t } = useTranslation();

  return (
    <Offcanvas isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.menu}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            {loggedUser ? (
              <UserPreview
                variant={UserPreviewVariant.Default}
                user={loggedUser}
              />
            ) : null}
            <AuthToggle
              theme={Theme.Light}
              tooltipPosition={
                loggedUser
                  ? TooltipPosition.BottomRight
                  : TooltipPosition.BottomCenter
              }
            />
          </div>
          <LanguageSelect />
        </div>
        <div className={styles.nav}>
          <PageLink url="/meetups" theme={Theme.Light}>
            {t('meetups')}
          </PageLink>
          <PageLink url="/news" theme={Theme.Light}>
            {t('news')}
          </PageLink>
        </div>
      </div>
    </Offcanvas>
  );
};
