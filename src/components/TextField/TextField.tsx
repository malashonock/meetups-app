import { Field, FieldProps } from 'formik';

import { InputLabel } from 'components';
import { HelperText } from 'components';
import { TextInput, TextInputVariant } from 'components';

import { HelperTextVariant } from 'components';

type TextFieldProps = {
  name: string;
  placeholder?: string;
  successText?: string;
  helperText?: string;
  labelText: string;
};

export const TextField = ({
  name,
  placeholder,
  successText,
  labelText,
  helperText,
}: TextFieldProps): JSX.Element => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const hasError = !!form.errors[name] && !!form.touched[name];
        const value = form.values[name];
        let variantHelperText = HelperTextVariant.Default;

        if (hasError) {
          variantHelperText = HelperTextVariant.Error;
        } else {
          if (successText && !!form.values[name] && !!form.touched[name]) {
            variantHelperText = HelperTextVariant.Success;
          }
        }

        const variantTextInput =
          (hasError
            ? TextInputVariant.Error
            : !!form.values[name] && TextInputVariant.Success) ||
          TextInputVariant.None;

        const resultHelperText =
          !!helperText && !form.touched[name] ? (
            <>{helperText}</>
          ) : hasError ? (
            form.errors[name] && <>{form.errors[name] as string}</>
          ) : (
            !!form.touched[name] && <>{successText}</>
          );

        return (
          <div>
            <InputLabel style={{ marginBottom: '8px' }}>{labelText}</InputLabel>
            <TextInput
              style={{ marginBottom: '4px', width: '500px' }}
              variant={variantTextInput}
              field={field}
              value={value}
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
};
