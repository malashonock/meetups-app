import classNames from 'classnames';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'default';
} & PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'primary',
  children,
  ...nativeButtonProps
}: ButtonProps): JSX.Element => {
  return (
    <button
      {...nativeButtonProps}
      className={classNames(styles.button, styles[variant])}
    >
      {children}
    </button>
  );
};
