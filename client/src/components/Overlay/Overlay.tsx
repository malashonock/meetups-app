import { PropsWithChildren } from 'react';

import styles from './Overlay.module.scss';

interface OverlayProps {
  onClick?: () => void;
}

export const Overlay = ({
  onClick,
  children,
}: PropsWithChildren<OverlayProps>): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={styles.container}
      data-testid="modal-overlay"
    >
      {children}
    </div>
  );
};
