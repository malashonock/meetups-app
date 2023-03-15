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
  onClose: () => void;
}

export const BurgerMenu = ({
  isOpen,
  onClose,
}: BurgerMenuProps): JSX.Element => {
  const { loggedUser } = useAuthStore();
  const { t } = useTranslation();

  return (
    <Offcanvas isOpen={isOpen} onClose={onClose}>
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
              onToggle={onClose}
            />
          </div>
          <LanguageSelect onSelect={onClose} />
        </div>
        <div className={styles.nav}>
          <PageLink url="/meetups" onFollowLink={onClose} theme={Theme.Light}>
            {t('meetups')}
          </PageLink>
          <PageLink url="/news" onFollowLink={onClose} theme={Theme.Light}>
            {t('news')}
          </PageLink>
        </div>
      </div>
    </Offcanvas>
  );
};
