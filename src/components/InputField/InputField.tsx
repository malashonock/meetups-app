import { FunctionComponent, HTMLAttributes } from 'react';
import { Field, FieldProps } from 'formik';

import { InputLabel, HelperText } from 'components';

import styles from './InputField.module.scss';
import classNames from 'classnames';

export enum InputFieldVariant {
  Error = 'error',
  Success = 'success',
  Default = 'default',
}

export type InputRenderProps = FieldProps & {
  variant?: InputFieldVariant;
  className?: string;
};

interface InputFieldProps {
  name: string;
  children: FunctionComponent<InputRenderProps>;
  labelText?: string;
  successText?: string;
  hintText?: string;
  containerAttributes?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
}

export type InputFieldExternalProps = Omit<InputFieldProps, 'children'>;

export const InputField = ({
  name,
  children,
  labelText,
  successText,
  hintText,
  containerAttributes,
}: InputFieldProps): JSX.Element => (
  <Field name={name}>
    {(formikProps: FieldProps) => {
      const InputComponent = children;
      const {
        field: { name },
        meta: { error, touched },
      } = formikProps;

      let variant = InputFieldVariant.Default;
      let helperText = hintText;

      const hasError = !!error;
      const isTouched = !!touched;

      if (isTouched && hasError) {
        variant = InputFieldVariant.Error;
        helperText = error;
      }

      if (isTouched && !hasError) {
        variant = InputFieldVariant.Success;

        if (successText) {
          helperText = successText;
        }
      }

      return (
        <div {...containerAttributes}>
          {labelText ? (
            <InputLabel name={name} className={styles.inputLabel}>
              {labelText}
            </InputLabel>
          ) : null}
          <InputComponent
            {...formikProps}
            variant={variant}
            className={classNames(styles.input, styles[variant])}
          />
          {helperText ? (
            <HelperText className={styles.helperText} variant={variant}>
              {helperText}
            </HelperText>
          ) : null}
        </div>
      );
    }}
  </Field>
);
