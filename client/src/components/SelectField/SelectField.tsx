import { ComponentProps } from 'react';
import ReactSelect from 'react-select';

import {
  InputField,
  InputFieldExternalProps,
  InputRenderProps,
} from 'components';
import { ArrayElementType, Nullable, Optional } from 'types';

import styles from './SelectField.module.scss';
import classNames from 'classnames';

export interface SelectOption<TValue> {
  value: TValue;
  label: string;
}

export type SelectFieldProps = InputFieldExternalProps & {
  selectProps?: ComponentProps<ReactSelect>;
  placeholderText?: string;
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
      variant,
    }: InputRenderProps<TValue>): JSX.Element => {
      const getOptionsFromFieldValues = (
        valueOrValues: Nullable<TValue> | TValue[],
      ): Nullable<SelectOption<TValue>> | SelectOption<TValue>[] => {
        const allOptions = (selectProps?.options ||
          []) as SelectOption<TValue>[];

        const findOptionByValue = (
          value: TValue,
        ): Optional<SelectOption<TValue>> => {
          return allOptions.find(
            (option: SelectOption<TValue>) => option.value === value,
          );
        };

        if (selectProps?.isMulti && Array.isArray(valueOrValues)) {
          const values = valueOrValues as TValue[];
          return values
            .map((value: TValue): Optional<SelectOption<TValue>> => {
              if (selectProps.options) {
                const matchingOption = findOptionByValue(value);
                return matchingOption;
              }
            })
            .filter(
              (value: Optional<SelectOption<TValue>>): boolean => !!value,
            ) as SelectOption<TValue>[];
        } else {
          const value = valueOrValues as TValue;
          return findOptionByValue(value) || null;
        }
      };

      const setFieldValueFromOption = (
        selectedOptionOrOptions: unknown,
      ): void => {
        let value: Nullable<TValue> | ArrayElementType<TValue>[];

        if (selectProps?.isMulti) {
          const options = selectedOptionOrOptions as SelectOption<
            ArrayElementType<TValue>
          >[];
          value = options.map(
            ({
              value,
            }: SelectOption<
              ArrayElementType<TValue>
            >): ArrayElementType<TValue> => value,
          );
        } else {
          const option = selectedOptionOrOptions as SelectOption<TValue>;
          value = option.value;
        }

        setFieldValue(field.name, value);
      };

      return (
        <div {...containerAttributes}>
          <ReactSelect
            {...selectProps}
            name={field.name}
            value={getOptionsFromFieldValues(field.value)}
            onChange={setFieldValueFromOption}
            onBlur={handleBlur}
            placeholder={placeholderText}
            classNames={{
              control: (state) =>
                classNames(styles.input, variant ? styles[variant] : '', {
                  [styles.focused]: state.isFocused,
                }),
              placeholder: () => styles.placeholder,
              option: (state) =>
                classNames(styles.option, {
                  [styles.selected]: state.isSelected,
                }),
              menu: () => styles.menu,
            }}
            styles={{
              option: (baseStyles, state) => ({
                ...baseStyles,
              }),
            }}
          />
        </div>
      );
    }}
  </InputField>
);
