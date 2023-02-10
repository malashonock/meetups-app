export const generateArray = <T>(count: number, generatorFn: () => T): T[] => {
  return Array(count).fill(undefined).map(generatorFn);
};
