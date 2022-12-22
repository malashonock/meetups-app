export interface FormattedDateTime {
  formattedWeekDay: string;
  formattedDate: string;
  formattedTime: string;
}

const formattedWeekDays = [
  'Воскр.',
  'Пон.',
  'Вт.',
  'Ср.',
  'Четв.',
  'Пятн.',
  'Субб.',
];

export const parseDateString = (dateString: string): FormattedDateTime => {
  const date = new Date(dateString);
  const locale = 'ru-RU';

  const formattedWeekDay = formattedWeekDays[date.getDay()];

  const formattedDate = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  });

  const formattedTime = date.toLocaleTimeString(locale, {
    timeStyle: 'short',
  });

  return {
    formattedWeekDay,
    formattedDate,
    formattedTime,
  };
};
