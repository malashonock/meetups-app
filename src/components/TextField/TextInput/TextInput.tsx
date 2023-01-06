import { AllHTMLAttributes } from 'react';
import classNames from 'classnames';

import { TextFieldVariant } from 'components';

import styles from './TextInput.module.scss';

type TextInputProps = {
  variant: TextFieldVariant;
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
