import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  Tooltip,
  TooltipPosition,
  TooltipVariant,
} from 'components';
import { useAuthStore } from 'hooks';

import styles from './AuthToggle.module.scss';
import { ReactComponent as LoginIcon } from './assets/login.svg';
import { ReactComponent as LogoutIcon } from './assets/logout.svg';

interface AuthToggleProps {
  tooltipPosition?: TooltipPosition;
}

export const AuthToggle = observer(
  ({
    tooltipPosition = TooltipPosition.BottomCenter,
  }: AuthToggleProps): JSX.Element => {
    const navigate = useNavigate();
    const { authStore, loggedUser } = useAuthStore();
    const { t } = useTranslation();

    const handleLogout = async (): Promise<void> => {
      await authStore?.logOut();
      navigate('/');
    };

    return (
      <div data-testid="auth-toggle">
        {loggedUser ? (
          <Tooltip
            variant={TooltipVariant.White}
            position={tooltipPosition}
            title={t('logoutTooltip.title')}
            description={t('logoutTooltip.text')}
          >
            <IconButton
              onClick={handleLogout}
              className={styles.button}
              aria-label="logout-button"
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Link to="/login">
            <Tooltip
              variant={TooltipVariant.White}
              position={tooltipPosition}
              title={t('loginTooltip.title')}
              description={t('loginTooltip.text')}
            >
              <IconButton className={styles.button} aria-label="login-button">
                <LoginIcon />
              </IconButton>
            </Tooltip>
          </Link>
        )}
      </div>
    );
  },
);
