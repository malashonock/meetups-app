import { PropsWithChildren, HTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './InputLabel.module.scss';

type InputLabelProps = {
  name: string;
} & PropsWithChildren &
  HTMLAttributes<HTMLLabelElement>;

export const InputLabel = ({
  name,
  children,
  ...nativeHtmlProps
}: InputLabelProps): JSX.Element => (
  <label
    {...nativeHtmlProps}
    htmlFor={name}
    className={classNames(nativeHtmlProps.className, styles.label)}
  >
    {children}
  </label>
);
