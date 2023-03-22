import { AllHTMLAttributes } from 'react';

export const TextInput = ({
  ...nativeHtmlProps
}: AllHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input {...nativeHtmlProps} data-testid="text-input" />
);
