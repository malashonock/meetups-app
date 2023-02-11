import { HTMLAttributes } from 'react';

export const TextInput = ({
  ...nativeHtmlProps
}: HTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input type="text" {...nativeHtmlProps} />
);
