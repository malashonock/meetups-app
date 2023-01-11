import {
  InputField,
  InputFieldExternalProps,
  InputRenderProps,
} from 'components';
import { ComponentProps } from 'react';
import DatePicker from 'react-datepicker';
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
  constraints?: DateTimePickerConstraints;
};

export const DateTimePicker = ({
  placeholderText = 'd MMM yyyy HH:mm',
  constraints = {},
  ...inputFieldProps
}: DateTimePickerProps): JSX.Element => (
  <InputField {...inputFieldProps}>
    {({
      field: { name, value },
      form: { setFieldValue, handleBlur },
      className,
    }: InputRenderProps): JSX.Element => {
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
