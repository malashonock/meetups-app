import { AllHTMLAttributes } from 'react';
import { Field, FieldProps } from 'formik';

import { InputLabel, HelperText, TextInput, TextArea } from 'components';

import styles from './TextField.module.scss';

export enum TextFieldVariant {
  Error = 'error',
  Success = 'success',
  Default = 'default',
}

type TextFieldProps = {
  name: string;
  labelText: string;
  placeholder?: string;
  successText?: string;
  helperText?: string;
  multiline?: boolean;
  maxLetterCount?: number;
} & AllHTMLAttributes<HTMLElement>;

export const TextField = ({
  name,
  labelText,
  placeholder,
  successText,
  helperText,
  multiline,
  maxLetterCount,
  ...nativeHtmlProps
}: TextFieldProps): JSX.Element => (
  <Field name={name}>
    {({ field, field: { value }, meta: { error, touched } }: FieldProps) => {
      const hasError = !!error && !!touched;

      let helperTextVariant = TextFieldVariant.Default;
      if (hasError) {
        helperTextVariant = TextFieldVariant.Error;
      } else {
        if (successText && !!value && !!touched) {
          helperTextVariant = TextFieldVariant.Success;
        }
      }
      const textInputVariant =
        (hasError
          ? TextFieldVariant.Error
          : !!value && TextFieldVariant.Success) || TextFieldVariant.Default;

      const finalHelperText = (
        <>
          {!!helperText && !touched
            ? helperText
            : hasError
            ? error
            : !!touched && successText}
        </>
      );

      const inputVariant = multiline ? (
        <TextArea
          {...field}
          className={styles.wrapper}
          variant={textInputVariant}
          placeholder={placeholder}
          maxLetterCount={maxLetterCount}
        />
      ) : (
        <TextInput
          {...field}
          className={styles.textInput}
          variant={textInputVariant}
          placeholder={placeholder}
        />
      );

      return (
        <div {...nativeHtmlProps}>
          <InputLabel className={styles.inputLabel}>{labelText}</InputLabel>
          {inputVariant}
          <HelperText variant={helperTextVariant}>{finalHelperText}</HelperText>
        </div>
      );
    }}
  </Field>
);
