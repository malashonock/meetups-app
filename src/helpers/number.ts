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
): string => {
  // start from most aggregating conversion
  let result = toFixedIfAny(convertBytesToMb(bytes), maxDecimalPlaces);

  if (+result > 0) {
    return `${result} Мб`;
  }

  // take less aggregating conversion
  result = toFixedIfAny(convertBytesToKb(bytes), maxDecimalPlaces);

  if (+result > 0) {
    return `${result} Кб`;
  }

  // return without aggregation
  result = toFixedIfAny(bytes, maxDecimalPlaces);
  return `${result} байт`;
};
