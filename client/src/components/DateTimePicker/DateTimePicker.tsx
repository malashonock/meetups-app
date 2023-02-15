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
import { useTranslation } from 'react-i18next';

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
  placeholderText,
  constraints = {},
  containerAttributes,
  ...inputFieldProps
}: DateTimePickerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
      {({
        field: { name, value },
        form: { setFieldValue, handleBlur, setFieldTouched },
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
            id={name}
            name={name}
            selected={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onCalendarClose={() => setFieldTouched(name, true)}
            showTimeSelect
            dateFormat="d MMM yyyy HH:mm"
            timeFormat="HH:mm"
            placeholderText={
              placeholderText ??
              (t('dateTimePicker.defaultPlaceholder') || 'd MMM yyyy HH:mm')
            }
            onMonthChange={adjustTimeListHeight}
            autoComplete="off"
            {...constraints}
          />
        );
      }}
    </InputField>
  );
};
