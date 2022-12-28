import classNames from 'classnames';
import { Field, FieldProps, ErrorMessage } from 'formik';

import styles from './TextInput.module.scss';
import { ErrorTransition } from '../HelperText/HelperText';

export function TextInput<T>(props: {
  name: keyof T;
  placeholder?: string;
  successText: string;
}): JSX.Element {
  const { name, placeholder, successText } = props;
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const hasError = !!form.errors[name] && !!form.touched[name];
        const value = form.values[name];
        return (
          <div>
            <input
              className={classNames(
                styles.input,
                hasError ? styles.error : !!form.values[name] && styles.success,
              )}
              {...field}
              type="text"
              value={value}
              placeholder={placeholder}
            />
            <ErrorTransition
              toggle={hasError}
              picked={!!form.touched[name]}
              successText={successText}
            >
              <ErrorMessage name={String(name)} />
            </ErrorTransition>
          </div>
        );
      }}
    </Field>
  );
}
