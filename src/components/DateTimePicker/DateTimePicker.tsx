import { Field, FieldProps } from 'formik';
import { HTMLAttributes } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.scss';

type DateTimePickerProps = {
  name: string;
  placeholderText?: string;
  // ...to be continued
} & HTMLAttributes<HTMLDivElement>;

export const DateTimePicker = ({
  name,
  placeholderText = 'd MMM yyyy HH:mm',
  ...nativeHtmlAttributes
}: DateTimePickerProps): JSX.Element => (
  <Field name={name}>
    {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => {
      const handleChange = (date: Date): void => setFieldValue(name, date);

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
        <div {...nativeHtmlAttributes}>
          <DatePicker
            name={name}
            selected={value}
            onChange={handleChange}
            showTimeSelect
            dateFormat="d MMM yyyy HH:mm"
            timeFormat="HH:mm"
            placeholderText={placeholderText}
            onMonthChange={adjustTimeListHeight}
          />
        </div>
      );
    }}
  </Field>
);
