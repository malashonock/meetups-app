import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

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
import { Theme } from 'types';

interface AuthToggleProps {
  theme?: Theme;
  tooltipPosition?: TooltipPosition;
  onToggle?: () => void;
}

export const AuthToggle = observer(
  ({
    theme = Theme.Dark,
    tooltipPosition = TooltipPosition.BottomCenter,
    onToggle,
  }: AuthToggleProps): JSX.Element => {
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const { loggedUser } = authStore;
    const { t } = useTranslation();

    const handleLogout = async (): Promise<void> => {
      await authStore.logOut();
      navigate('/');
      onToggle?.call(null);
    };

    const tooltipVariant: TooltipVariant =
      theme === Theme.Dark ? TooltipVariant.White : TooltipVariant.Colored;

    return (
      <div data-testid="auth-toggle">
        {loggedUser ? (
          <Tooltip
            variant={tooltipVariant}
            position={tooltipPosition}
            title={t('logoutTooltip.title')}
            description={t('logoutTooltip.text')}
          >
            <IconButton
              theme={theme}
              className={classNames(styles.button, styles[theme])}
              onClick={handleLogout}
              aria-label="logout-button"
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Link to="/login" onClick={onToggle}>
            <Tooltip
              variant={tooltipVariant}
              position={tooltipPosition}
              title={t('loginTooltip.title')}
              description={t('loginTooltip.text')}
            >
              <IconButton
                theme={theme}
                className={classNames(styles.button, styles[theme])}
                aria-label="login-button"
              >
                <LoginIcon />
              </IconButton>
            </Tooltip>
          </Link>
        )}
      </div>
    );
  },
);
