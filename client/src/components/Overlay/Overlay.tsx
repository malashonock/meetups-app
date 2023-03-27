import { PropsWithChildren } from 'react';

import styles from './Overlay.module.scss';

interface OverlayProps {
  onClick?: () => void;
  zIndex?: number;
}

export const Overlay = ({
  onClick,
  zIndex = 100,
  children,
}: PropsWithChildren<OverlayProps>): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={styles.container}
      data-testid="modal-overlay"
      style={{
        zIndex,
      }}
    >
      {children}
    </div>
  );
};
