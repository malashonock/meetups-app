import { HTMLAttributes } from 'react';

type TextInputProps = {
  // TODO: multiline?
} & HTMLAttributes<HTMLInputElement>;

export const TextInput = ({
  ...nativeHtmlProps
}: TextInputProps): JSX.Element => <input type="text" {...nativeHtmlProps} />;
