import { AllHTMLAttributes } from 'react';
import { Field, FieldProps } from 'formik';

import {
  InputLabel,
  HelperText,
  TextInput,
  InputFieldVariant,
} from 'components';

import styles from './TextField.module.scss';

type TextFieldProps = {
  name: string;
  labelText: string;
  placeholder?: string;
  successText?: string;
  helperText?: string;
} & AllHTMLAttributes<HTMLElement>;

export const TextField = ({
  name,
  labelText,
  placeholder,
  successText,
  helperText,
  ...nativeHtmlProps
}: TextFieldProps): JSX.Element => (
  <Field name={name}>
    {({ field, field: { value }, meta: { error, touched } }: FieldProps) => {
      const hasError = !!error && !!touched;

      let helperTextVariant = InputFieldVariant.Default;
      if (hasError) {
        helperTextVariant = InputFieldVariant.Error;
      } else {
        if (successText && !!value && !!touched) {
          helperTextVariant = InputFieldVariant.Success;
        }
      }

      const textInputVariant =
        (hasError
          ? InputFieldVariant.Error
          : !!value && InputFieldVariant.Success) || InputFieldVariant.Default;

      const finalHelperText = (
        <>
          {!!helperText && !touched
            ? helperText
            : hasError
            ? error
            : !!touched && successText}
        </>
      );

      return (
        <div {...nativeHtmlProps}>
          <InputLabel name={name} className={styles.inputLabel}>
            {labelText}
          </InputLabel>
          <TextInput
            {...field}
            className={styles.textInput}
            variant={textInputVariant}
            placeholder={placeholder}
          />
          <HelperText variant={helperTextVariant}>{finalHelperText}</HelperText>
        </div>
      );
    }}
  </Field>
);
