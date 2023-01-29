import { i18n } from 'i18next';

// Inspired by: https://stackoverflow.com/a/32229831
const toFixedIfAny = (num: number, maxDecimalPlaces: number): string =>
  +num.toFixed(maxDecimalPlaces) + '';

export const convertBytesToMb = (bytes: number): number => {
  const BYTES_IN_MEGABYTE = 1_000_000;
  return bytes / BYTES_IN_MEGABYTE;
};

export const convertBytesToKb = (bytes: number): number => {
  const BYTES_IN_KILOBYTE = 1_000;
  return bytes / BYTES_IN_KILOBYTE;
};

export const getFileSizeString = (
  bytes: number,
  maxDecimalPlaces: number = 0,
  i18n?: i18n,
): string => {
  // start from most aggregating conversion
  let result = toFixedIfAny(convertBytesToMb(bytes), maxDecimalPlaces);

  if (+result > 0) {
    return i18n?.t('fileSizeString.Mb', { fileSize: result }) ?? `${result} Mb`;
  }

  // take less aggregating conversion
  result = toFixedIfAny(convertBytesToKb(bytes), maxDecimalPlaces);

  if (+result > 0) {
    return i18n?.t('fileSizeString.Kb', { fileSize: result }) ?? `${result} Kb`;
  }

  // return without aggregation
  result = toFixedIfAny(bytes, maxDecimalPlaces);
  return (
    i18n?.t('fileSizeString.bytes', { fileSize: result }) ?? `${result} bytes`
  );
};
