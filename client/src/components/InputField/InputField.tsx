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

export interface InputFieldExternalProps {
  name: string;
  labelText?: string;
  successText?: string;
  hintText?: string;
}

type InputFieldProps = InputFieldExternalProps & {
  children: FunctionComponent<InputRenderProps>;
  containerAttributes?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
};

export const InputField = ({
  name,
  children: inputComponent,
  labelText,
  successText,
  hintText,
  containerAttributes,
}: InputFieldProps): JSX.Element => (
  <Field name={name}>
    {(formikProps: FieldProps) => {
      const {
        field: { name },
        meta: { error, touched },
      } = formikProps;

      let inputVariant: InputFieldVariant;
      let helperTextVariant: InputFieldVariant;
      inputVariant = helperTextVariant = InputFieldVariant.Default;
      let helperText = hintText;

      const hasError = !!error;
      const isTouched = !!touched;

      if (isTouched && hasError) {
        inputVariant = helperTextVariant = InputFieldVariant.Error;
        helperText = error;
      }

      if (isTouched && !hasError) {
        inputVariant = InputFieldVariant.Success;

        if (successText) {
          helperTextVariant = InputFieldVariant.Success;
          helperText = successText;
        }
      }

      return (
        <div
          {...containerAttributes}
          className={classNames(
            containerAttributes?.className,
            styles.container,
          )}
        >
          {labelText ? (
            <InputLabel name={name} className={styles.inputLabel}>
              {labelText}
            </InputLabel>
          ) : null}
          {inputComponent({
            ...formikProps,
            variant: inputVariant,
            className: classNames(styles.input, styles[inputVariant]),
          })}
          {helperText ? (
            <HelperText
              className={styles.helperText}
              variant={helperTextVariant}
            >
              {helperText}
            </HelperText>
          ) : null}
        </div>
      );
    }}
  </Field>
);
