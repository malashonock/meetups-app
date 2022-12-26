import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.scss';

export const DateTimePicker = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const handleChange = (date: Date) => setDate(date);

  return (
    <DatePicker
      selected={date}
      onChange={handleChange}
      showTimeSelect
      dateFormat="d MMM yyyy HH:mm"
      timeFormat="HH:mm"
    ></DatePicker>
  );
};
