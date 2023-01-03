import { PropsWithChildren } from 'react';
import styles from './HelperText.module.scss';
import classNames from 'classnames';

type HelperTextProps = {
  variant: 'error' | 'success' | false;
  picked: boolean;
} & PropsWithChildren;

export const HelperText = ({
  variant,
  picked,
  children,
}: HelperTextProps): JSX.Element => {
  return (
    <div
      className={classNames(
        styles.container,
        picked && variant && styles[variant],
      )}
    >
      {children}
    </div>
  );
};
