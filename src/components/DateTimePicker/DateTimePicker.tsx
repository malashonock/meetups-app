import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.scss';

export const DateTimePicker = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const handleChange = (date: Date) => setDate(date);

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
      selected={date}
      onChange={handleChange}
      showTimeSelect
      dateFormat="d MMM yyyy HH:mm"
      timeFormat="HH:mm"
      placeholderText="d MMM yyyy HH:mm"
      onMonthChange={adjustTimeListHeight}
    ></DatePicker>
  );
};
