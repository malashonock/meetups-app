import { PropsWithChildren } from 'react';

import styles from './Overlay.module.scss';

export const Overlay = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className={styles.container} data-testid="modal-overlay">
      {children}
    </div>
  );
};
