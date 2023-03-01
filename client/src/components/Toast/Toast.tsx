import classNames from 'classnames';

import { Typography, IconButton } from 'components';
import { Alert, AlertSeverity } from 'types';

import styles from './Toast.module.scss';
import { ReactComponent as ErrorIcon } from './assets/error.svg';
import { ReactComponent as WarningIcon } from './assets/warning.svg';
import { ReactComponent as SuccessIcon } from './assets/success.svg';
import { ReactComponent as InfoIcon } from './assets/info.svg';
import { ReactComponent as CloseIcon } from './assets/cross.svg';

interface ToastProps {
  alert: Alert;
}

export const Toast = ({ alert }: ToastProps): JSX.Element => {
  const { severity, title, text: description } = alert;

  const handleClose = (): void => {
    alert.dismiss();
  };

  const renderIcon = (): JSX.Element => {
    switch (severity) {
      case AlertSeverity.Error:
        return <ErrorIcon className={styles.icon} />;
      case AlertSeverity.Warning:
        return <WarningIcon className={styles.icon} />;
      case AlertSeverity.Success:
        return <SuccessIcon className={styles.icon} />;
      case AlertSeverity.Info:
        return <InfoIcon className={styles.icon} />;
    }
  };

  return (
    <div className={classNames(styles.toast, styles[severity])}>
      <span className={styles.icon}>{renderIcon()}</span>
      <span className={styles.text}>
        <Typography className={styles.title}>{title}</Typography>
        <Typography className={styles.description} noWrap>
          {description}
        </Typography>
      </span>
      <IconButton className={styles.closeBtn} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </div>
  );
};
