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

const defaultLocale: Intl.LocalesArgument = 'ru-RU';

const defaultDateOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
};

const defaultTimeOptions: Intl.DateTimeFormatOptions = {
  timeStyle: 'short',
};

export interface DateParserOptions {
  locale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
  timeOptions?: Intl.DateTimeFormatOptions;
}

export const parseDateString = (
  dateString: string,
  options?: DateParserOptions,
): FormattedDateTime => {
  const date = new Date(dateString);

  let locale: Intl.LocalesArgument | undefined;
  let dateOptions: Intl.DateTimeFormatOptions | undefined;
  let timeOptions: Intl.DateTimeFormatOptions | undefined;

  ({
    locale = defaultLocale,
    dateOptions = defaultDateOptions,
    timeOptions = defaultTimeOptions,
  } = options ?? {});

  const formattedWeekDay = formattedWeekDays[date.getDay()];
  const formattedDate = date.toLocaleDateString(locale, dateOptions);
  const formattedTime = date.toLocaleTimeString(locale, timeOptions);

  return {
    formattedWeekDay,
    formattedDate,
    formattedTime,
  };
};
