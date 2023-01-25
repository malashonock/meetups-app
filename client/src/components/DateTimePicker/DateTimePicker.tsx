import { ComponentProps } from 'react';
import DatePicker from 'react-datepicker';

import {
  InputField,
  InputFieldExternalProps,
  InputRenderProps,
} from 'components';
import { Maybe } from 'types';

import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.scss';

type DateTimePickerConstraints = Pick<
  ComponentProps<typeof DatePicker>,
  | 'filterDate'
  | 'filterTime'
  | 'startDate'
  | 'endDate'
  | 'minDate'
  | 'minTime'
  | 'maxDate'
  | 'maxTime'
  | 'allowSameDay'
  | 'required'
>;

type DateTimePickerProps = InputFieldExternalProps & {
  placeholderText?: string;
  containerAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
  constraints?: DateTimePickerConstraints;
};

export const DateTimePicker = ({
  placeholderText = 'd MMM yyyy HH:mm',
  constraints = {},
  containerAttributes,
  ...inputFieldProps
}: DateTimePickerProps): JSX.Element => (
  <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
    {({
      field: { name, value },
      form: { setFieldValue, handleBlur },
      className,
    }: InputRenderProps<Maybe<Date>>): JSX.Element => {
      const handleChange = (date: Date | null): void =>
        setFieldValue(name, date);

      const adjustTimeListHeight = () => {
        const dayNamesHeight = document.querySelector<HTMLDivElement>(
          '.react-datepicker__day-names',
        )?.clientHeight;
        const monthHeight = document.querySelector<HTMLDivElement>(
          '.react-datepicker__month',
        )?.clientHeight;
        const timeList = document.querySelector<HTMLDivElement>(
          '.react-datepicker__time-list',
        );

        if (timeList && dayNamesHeight && monthHeight) {
          timeList.style.setProperty(
            '--time-list-height',
            `${dayNamesHeight + monthHeight}px`,
          );
        }
      };

      return (
        <DatePicker
          className={className}
          name={name}
          selected={value}
          onChange={handleChange}
          onSelect={handleChange} // hack to make onChange fire
          onBlur={handleBlur}
          showTimeSelect
          dateFormat="d MMM yyyy HH:mm"
          timeFormat="HH:mm"
          placeholderText={placeholderText}
          onMonthChange={adjustTimeListHeight}
          autoComplete="off"
          {...constraints}
        />
      );
    }}
  </InputField>
);
