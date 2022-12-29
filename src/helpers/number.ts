// Inspired by these solutions:
// https://stackoverflow.com/a/32229831
// https://stackoverflow.com/a/32330345

declare global {
  interface Number {
    toFixedIfAny: (maxDecimalPlaces: number) => string;
  }
}

Number.prototype.toFixedIfAny = function (maxPrecision: number) {
  return +this.toFixed(maxPrecision) + '';
};

export const convertBytesToMb = (bytes: number): number => {
  const BYTES_IN_MEGABYTE = 1_000_000;
  return bytes / BYTES_IN_MEGABYTE;
};
