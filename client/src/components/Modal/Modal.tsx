import { PropsWithChildren, useEffect } from 'react';

import { Overlay, Portal } from 'components';
import { Nullable } from 'types';

import styles from './Modal.module.scss';

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

export const Modal = ({
  show,
  onClose,
  children,
}: PropsWithChildren<ModalProps>): Nullable<JSX.Element> => {
  // Close modal on Escape button
  useEffect(() => {
    const closeOnEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.addEventListener('keydown', closeOnEscapeKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose]);

  return show ? (
    <Portal wrapperId="modal-root">
      <Overlay>
        <div className={styles.content}>{children}</div>
      </Overlay>
    </Portal>
  ) : null;
};
