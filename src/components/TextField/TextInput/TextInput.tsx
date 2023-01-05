import styles from './TextInput.module.scss';

import classNames from 'classnames';

import { AllHTMLAttributes } from 'react';

export enum TextInputVariant {
  Error = 'error',
  Success = 'success',
  None = 'none',
}

type TextInputProps = {
  variant: TextInputVariant;
  field?: object;
} & AllHTMLAttributes<HTMLInputElement>;

export const TextInput = ({
  variant,
  field,
  ...nativeHtmlProps
}: TextInputProps): JSX.Element => (
  <input
    className={classNames(styles.input, styles[variant])}
    type="text"
    {...field}
    {...nativeHtmlProps}
  />
);
