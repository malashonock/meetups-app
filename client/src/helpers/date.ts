export interface FormattedDateTime {
  formattedWeekdayShort: string;
  formattedWeekdayLong: string;
  formattedDate: string;
  formattedTime: string;
}

const formattedWeekdaysShort = [
  'Воскр.',
  'Пон.',
  'Вт.',
  'Ср.',
  'Четв.',
  'Пятн.',
  'Субб.',
];

const formattedWeekdaysLong = [
  'Воскресение',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
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

  const formattedWeekdayShort = formattedWeekdaysShort[date.getDay()];
  const formattedWeekdayLong = formattedWeekdaysLong[date.getDay()];
  const formattedDate = date.toLocaleDateString(locale, dateOptions);
  const formattedTime = date.toLocaleTimeString(locale, timeOptions);

  return {
    formattedWeekdayShort,
    formattedWeekdayLong,
    formattedDate,
    formattedTime,
  };
};

export function isPast(date: Date): boolean;
export function isPast(dateString: string): boolean;
export function isPast(dateOrString: Date | string): boolean {
  const now = new Date();
  const date = dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  return date <= now;
}
