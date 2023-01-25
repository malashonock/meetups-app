export type ArrayElementType<T> = T extends Array<infer TElement>
  ? TElement
  : T;
