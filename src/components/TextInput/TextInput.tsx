import { AllHTMLAttributes } from 'react';
import classNames from 'classnames';

import { InputFieldVariant } from 'components';

import styles from './TextInput.module.scss';

type TextInputProps = {
  variant: InputFieldVariant;
} & AllHTMLAttributes<HTMLInputElement>;

export const TextInput = ({
  variant,
  ...nativeHtmlProps
}: TextInputProps): JSX.Element => (
  <input
    type="text"
    {...nativeHtmlProps}
    className={classNames(
      nativeHtmlProps.className,
      styles.input,
      styles[variant],
    )}
  />
);
