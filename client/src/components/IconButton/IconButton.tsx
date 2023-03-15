import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Theme } from 'types';

import styles from './IconButton.module.scss';

type IconButtonProps = {
  theme?: Theme;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = ({
  theme = Theme.Light,
  children,
  ...nativeButtonProps
}: PropsWithChildren<IconButtonProps>): JSX.Element => (
  <button
    {...nativeButtonProps}
    className={classNames(
      styles.button,
      styles[theme],
      nativeButtonProps.className,
    )}
  >
    {children}
  </button>
);
