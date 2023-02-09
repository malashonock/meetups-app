import { i18n } from 'i18next';

export interface FormattedDateTime {
  formattedWeekdayShort: string;
  formattedWeekdayLong: string;
  formattedDate: string;
  formattedTime: string;
}

const defaultLocale: Intl.LocalesArgument = 'ru-RU';

const defaultDateOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
};

const defaultTimeOptions: Intl.DateTimeFormatOptions = {
  timeStyle: 'short',
};

const getFormattedWeekday = (
  date: Date,
  weekdayFormat: 'short' | 'long',
  i18n?: i18n,
  locale: Intl.LocalesArgument = defaultLocale,
) => {
  // try to look up in i18n dictionaries
  if (i18n) {
    const formattedWeekdays: string[] = i18n.t(
      `formattedWeekdays.${weekdayFormat}`,
      { returnObjects: true },
    );
    const weekdayIndex: number = date.getDay();
    return formattedWeekdays[weekdayIndex];
  }

  // otherwise, return default formatted weekday name
  return date.toLocaleDateString(locale, { weekday: weekdayFormat });
};

export interface DateParserOptions {
  i18n?: i18n;
  locale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
  timeOptions?: Intl.DateTimeFormatOptions;
}

export const parseDate = (
  dateOrString: Date | string,
  options?: DateParserOptions,
): FormattedDateTime => {
  const date =
    typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;

  let locale: Intl.LocalesArgument | undefined;
  let dateOptions: Intl.DateTimeFormatOptions | undefined;
  let timeOptions: Intl.DateTimeFormatOptions | undefined;
  let i18n: i18n | undefined;

  ({
    i18n,
    locale = defaultLocale,
    dateOptions = defaultDateOptions,
    timeOptions = defaultTimeOptions,
  } = options ?? {});

  const formattedWeekdayShort = getFormattedWeekday(
    date,
    'short',
    i18n,
    locale,
  );
  const formattedWeekdayLong = getFormattedWeekday(date, 'long', i18n, locale);
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
  const date =
    dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  return date <= now;
}

export const SECONDS_IN_MINUTE = 60;
export const MILLISECONDS_IN_SECOND = 1_000;
