import { Field, FieldProps } from 'formik';

import { InputLabel } from './InputLabel/InputLabel';
import { HelperText } from './HelperText/HelperText';
import { InputText } from './InputText/InputText';
import { Typography } from 'components/Typography/Typography';

type TextInputProps = {
  name: string;
  placeholder?: string;
  successText: string;
  labelText: string;
};

export const TextInput = ({
  name,
  placeholder,
  successText,
  labelText,
}: TextInputProps): JSX.Element => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const hasError = !!form.errors[name] && !!form.touched[name];
        const value = form.values[name];
        const viewVariant = () => {
          return hasError ? 'error' : !!form.values[name] && 'success';
        };
        return (
          <div>
            <InputLabel children={labelText} />
            <InputText
              type="text"
              variant={viewVariant()}
              field={field}
              value={value}
              placeholder={placeholder}
            />
            <HelperText
              name={name}
              variant={viewVariant()}
              picked={!!form.touched[name]}
            >
              {hasError ? (
                <div>
                  {form.errors[name] && (
                    <Typography>{form.errors[name] as string}</Typography>
                  )}
                </div>
              ) : (
                <div>
                  {form.touched[name] && <Typography>{successText}</Typography>}
                </div>
              )}
            </HelperText>
          </div>
        );
      }}
    </Field>
  );
};
