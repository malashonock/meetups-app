import classNames from 'classnames';

import { Typography, IconButton } from 'components';
import { AlertSeverity, Maybe } from 'types';

import styles from './Toast.module.scss';
import { ReactComponent as ErrorIcon } from './assets/error.svg';
import { ReactComponent as WarningIcon } from './assets/warning.svg';
import { ReactComponent as SuccessIcon } from './assets/success.svg';
import { ReactComponent as InfoIcon } from './assets/info.svg';
import { ReactComponent as CloseIcon } from './assets/cross.svg';

interface ToastProps {
  variant: AlertSeverity;
  title?: Maybe<string>;
  description: string;
  onClose: () => void;
}

export const Toast = ({
  variant,
  title,
  description,
  onClose,
}: ToastProps): JSX.Element => {
  const renderIcon = (): JSX.Element => {
    switch (variant) {
      case AlertSeverity.Error:
        return <ErrorIcon className={styles.icon} data-testid="icon-error" />;
      case AlertSeverity.Warning:
        return (
          <WarningIcon className={styles.icon} data-testid="icon-warning" />
        );
      case AlertSeverity.Success:
        return (
          <SuccessIcon className={styles.icon} data-testid="icon-success" />
        );
      case AlertSeverity.Info:
        return <InfoIcon className={styles.icon} data-testid="icon-info" />;
    }
  };

  return (
    <div
      className={classNames(styles.toast, styles[variant])}
      data-testid="toast"
    >
      <span className={styles.icon}>{renderIcon()}</span>
      <span className={styles.text}>
        {title !== undefined && (
          <Typography className={styles.title}>{title}</Typography>
        )}
        <Typography className={styles.description} noWrap>
          {description}
        </Typography>
      </span>
      <IconButton
        className={styles.closeBtn}
        onClick={onClose}
        data-testid="btn-close"
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
};
