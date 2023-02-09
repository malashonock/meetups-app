import { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './IconButton.module.scss';

export const IconButton = ({
  children,
  ...nativeButtonProps
}: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>): JSX.Element => (
  <button
    {...nativeButtonProps}
    className={classNames(nativeButtonProps.className, styles.button)}
  >
    {children}
  </button>
);
