import { AllHTMLAttributes } from 'react';
import { Field, FieldProps } from 'formik';

import { InputLabel, HelperText, TextInput } from 'components';

import styles from './TextField.module.scss';

export enum TextFieldVariant {
  Error = 'error',
  Success = 'success',
  Default = 'default',
}

type TextFieldProps = {
  name: string;
  placeholder?: string;
  successText?: string;
  helperText?: string;
  labelText: string;
} & AllHTMLAttributes<HTMLElement>;

export const TextField = ({
  name,
  placeholder,
  successText,
  labelText,
  helperText,
  ...nativeHtmlProps
}: TextFieldProps): JSX.Element => (
  <Field name={name}>
    {({ field, form: { touched, values }, meta: { error } }: FieldProps) => {
      const hasError = !!error && !!touched[name];
      let variantHelperText = TextFieldVariant.Default;

      if (hasError) {
        variantHelperText = TextFieldVariant.Error;
      } else {
        if (successText && !!values[name] && !!touched[name]) {
          variantHelperText = TextFieldVariant.Success;
        }
      }

      const variantTextInput =
        (hasError
          ? TextFieldVariant.Error
          : !!values[name] && TextFieldVariant.Success) ||
        TextFieldVariant.Default;

      const resultHelperText =
        !!helperText && !touched[name] ? (
          <>{helperText}</>
        ) : hasError ? (
          error && <>{error as string}</>
        ) : (
          !!touched[name] && <>{successText}</>
        );

      return (
        <div {...nativeHtmlProps}>
          <InputLabel className={styles.inputLabel}>{labelText}</InputLabel>
          <TextInput
            className={styles.textInput}
            {...field}
            variant={variantTextInput}
            placeholder={placeholder}
          />
          <HelperText variant={variantHelperText}>
            {resultHelperText}
          </HelperText>
        </div>
      );
    }}
  </Field>
);
