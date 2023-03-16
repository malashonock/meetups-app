import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import {
  Button,
  ButtonVariant,
  Modal,
  Typography,
  TypographyComponent,
} from 'components';

import styles from './ConfirmDialog.module.scss';

export interface ConfirmDialogProps {
  isOpen: boolean;
  prompt: string;
  confirmBtnLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  prompt,
  confirmBtnLabel = 'OK',
  onConfirm,
  onClose,
}: ConfirmDialogProps): JSX.Element => {
  const { t } = useTranslation();

  const confirmAndClose = (): void => {
    onConfirm();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className={styles.dialog} data-testid="confirm-dialog">
        <Typography
          className={styles.prompt}
          component={TypographyComponent.Paragraph}
        >
          {prompt}
        </Typography>
        <div className={styles.actionButtons}>
          <Button
            id="confirm-button"
            className={classNames(styles.actionBtn, styles.confirmBtn)}
            variant={ButtonVariant.Primary}
            onClick={confirmAndClose}
          >
            {confirmBtnLabel ?? 'OK'}
          </Button>
          <Button
            id="cancel-button"
            className={classNames(styles.actionBtn, styles.cancelBtn)}
            variant={ButtonVariant.Default}
            onClick={onClose}
          >
            {t('formButtons.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
