export const generateArray = <T>(
  count: number,
  generatorFn: (index: number) => T,
): T[] => {
  return Array(count)
    .fill(undefined)
    .map((element: T, index: number) => generatorFn(index));
};
