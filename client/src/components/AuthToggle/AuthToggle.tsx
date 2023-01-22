import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { IconButton, Tooltip, TooltipVariant } from 'components';
import { useAuthStore } from 'hooks';

import styles from './AuthToggle.module.scss';
import { ReactComponent as LoginIcon } from './assets/login.svg';
import { ReactComponent as LogoutIcon } from './assets/logout.svg';

export const AuthToggle = observer((): JSX.Element => {
  const navigate = useNavigate();
  const { authStore, loggedUser } = useAuthStore();

  const handleLogout = async (): Promise<void> => {
    await authStore?.logOut();
    navigate('/');
  };

  return loggedUser ? (
    <Tooltip
      variant={TooltipVariant.White}
      title="Выход"
      description="Выйти из своей учетной записи"
    >
      <IconButton onClick={handleLogout} className={styles.button}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Link to="/login">
      <Tooltip
        variant={TooltipVariant.White}
        title="Вход"
        description="Войти в свою учетную запись"
      >
        <IconButton className={styles.button}>
          <LoginIcon />
        </IconButton>
      </Tooltip>
    </Link>
  );
});
