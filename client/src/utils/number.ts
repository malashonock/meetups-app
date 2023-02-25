import { i18n } from 'i18next';

export type Bytes = number;
export type Kb = number;
export type Mb = number;

// Inspired by: https://stackoverflow.com/a/32229831
const toFixedIfAny = (num: number, maxDecimalPlaces: number): string =>
  +num.toFixed(maxDecimalPlaces) + '';

export const convertBytesToMb = (fileSize: Bytes): Mb => {
  const BYTES_IN_MEGABYTE = 1_000_000;
  return fileSize / BYTES_IN_MEGABYTE;
};

export const convertBytesToKb = (fileSize: Bytes): Kb => {
  const BYTES_IN_KILOBYTE = 1_000;
  return fileSize / BYTES_IN_KILOBYTE;
};

export const getFileSizeString = (
  fileSize: Bytes,
  maxDecimalPlaces: number = 0,
  i18n?: i18n,
): string => {
  // start from most aggregating conversion
  let result = toFixedIfAny(convertBytesToMb(fileSize), maxDecimalPlaces);

  if (+result > 0) {
    return i18n?.t('fileSizeString.Mb', { fileSize: result }) ?? `${result} Mb`;
  }

  // take less aggregating conversion
  result = toFixedIfAny(convertBytesToKb(fileSize), maxDecimalPlaces);

  if (+result > 0) {
    return i18n?.t('fileSizeString.Kb', { fileSize: result }) ?? `${result} Kb`;
  }

  // return without aggregation
  result = toFixedIfAny(fileSize, maxDecimalPlaces);
  return (
    i18n?.t('fileSizeString.fileSize', { fileSize: result }) ??
    `${result} fileSize`
  );
};
