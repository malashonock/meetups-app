import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { IconButton, Tooltip, TooltipVariant } from 'components';
import { useAuthStore } from 'hooks';

import styles from './AuthToggle.module.scss';
import { ReactComponent as LoginIcon } from './assets/login.svg';
import { ReactComponent as LogoutIcon } from './assets/logout.svg';

export const AuthToggle = observer((): JSX.Element => {
  const navigate = useNavigate();
  const { authStore, loggedUser } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = async (): Promise<void> => {
    await authStore?.logOut();
    navigate('/');
  };

  return loggedUser ? (
    <Tooltip
      variant={TooltipVariant.White}
      title={t('loginTooltip.title')}
      description={t('loginTooltip.text')}
    >
      <IconButton onClick={handleLogout} className={styles.button}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Link to="/login">
      <Tooltip
        variant={TooltipVariant.White}
        title={t('logoutTooltip.title')}
        description={t('logoutTooltip.text')}
      >
        <IconButton className={styles.button}>
          <LoginIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
});
