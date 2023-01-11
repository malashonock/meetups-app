import { HTMLAttributes, PropsWithChildren } from 'react';
import styles from './IconButton.module.scss';

export const IconButton = ({
  children,
  ...nativeButtonProps
}: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>): JSX.Element => (
  <button {...nativeButtonProps} className={styles.button}>
    {children}
  </button>
);
