import classNames from 'classnames';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './Button.module.scss';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Default = 'default',
}

type ButtonProps = {
  variant?: ButtonVariant;
} & PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = ButtonVariant.Primary,
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
