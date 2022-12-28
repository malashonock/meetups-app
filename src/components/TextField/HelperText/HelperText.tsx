import { PropsWithChildren } from 'react';
import styles from './HelperText.module.scss';

export const containerStyles = styles.container;

type Props = {
  toggle: boolean;
  picked: boolean;
  successText: string;
} & PropsWithChildren;

export function ErrorTransition({
  toggle,
  picked,
  successText,
  children,
}: Props): JSX.Element {
  return toggle ? (
    <div className={styles.error}>{children}</div>
  ) : (
    <div>{picked && <div className={styles.success}>{successText}</div>}</div>
  );
}
