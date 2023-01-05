// Inspired by these solutions:
// https://stackoverflow.com/a/32229831
// https://stackoverflow.com/a/32330345

declare global {
  interface Number {
    toFixedIfAny: (maxDecimalPlaces: number) => string;
  }
}

Number.prototype.toFixedIfAny = function (
  this: number,
  maxDecimalPlaces: number,
): string {
  return +this.toFixed(maxDecimalPlaces) + '';
};

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
  let result = convertBytesToMb(bytes).toFixedIfAny(maxDecimalPlaces);

  if (+result > 0) {
    return `${result} Mb`;
  }

  // take less aggregating conversion
  result = convertBytesToKb(bytes).toFixedIfAny(maxDecimalPlaces);

  if (+result > 0) {
    return `${result} Kb`;
  }

  // return without aggregation
  result = bytes.toFixedIfAny(maxDecimalPlaces);
  return `${result} b`;
};
