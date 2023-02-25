import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './IconButton.module.scss';

export const IconButton = ({
  children,
  ...nativeButtonProps
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): JSX.Element => (
  <button
    {...nativeButtonProps}
    className={classNames(nativeButtonProps.className, styles.button)}
  >
    {children}
  </button>
);
