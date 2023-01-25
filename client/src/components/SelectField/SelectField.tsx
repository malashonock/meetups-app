import { ComponentProps } from 'react';
import ReactSelect from 'react-select';

import {
  InputField,
  InputFieldExternalProps,
  InputRenderProps,
} from 'components';
import { ArrayElementType, Nullable } from 'types';

interface SelectOption<TValue> {
  value: Nullable<TValue>;
  label: string;
}

type SelectFieldProps = InputFieldExternalProps & {
  placeholderText?: string;
  selectProps?: ComponentProps<ReactSelect>;
  containerAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
};

export const SelectField = <TValue extends unknown>({
  placeholderText,
  selectProps,
  containerAttributes,
  ...inputFieldProps
}: SelectFieldProps): JSX.Element => (
  <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
    {({
      field,
      form: { setFieldValue, handleBlur },
      className,
    }: InputRenderProps<TValue>): JSX.Element => {
      const setFieldValueFromOption = (optionOrOptions: unknown): void => {
        // if select can contain only one value, value is of type TValue?
        // if select can contain multiple values, value is of type TValue?[]
        let value: Nullable<TValue> | Nullable<ArrayElementType<TValue>>[];

        if (Array.isArray(optionOrOptions)) {
          const options = optionOrOptions as SelectOption<
            ArrayElementType<TValue>
          >[];
          value = options.map(
            ({
              value,
            }: SelectOption<ArrayElementType<TValue>>): Nullable<
              ArrayElementType<TValue>
            > => value,
          );
        } else {
          const option = optionOrOptions as SelectOption<TValue>;
          value = option.value;
        }

        setFieldValue(field.name, value);
      };

      return (
        <ReactSelect
          {...selectProps}
          name={field.name}
          onChange={setFieldValueFromOption}
          onBlur={handleBlur}
          placeholder={placeholderText}
        />
      );
    }}
  </InputField>
);
