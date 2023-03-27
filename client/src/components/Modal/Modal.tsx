import { PropsWithChildren } from 'react';

import { Overlay, Portal } from 'components';
import { useOnKeyDown } from 'hooks';
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
  useOnKeyDown('Escape', onClose);

  return show ? (
    <Portal wrapperId="modal-root">
      <Overlay>
        <div className={styles.content}>{children}</div>
      </Overlay>
    </Portal>
  ) : null;
};
