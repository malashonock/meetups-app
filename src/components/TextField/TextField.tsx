import {
  InputFieldExternalProps,
  InputField,
  InputRenderProps,
} from 'components';

type TextFieldProps = InputFieldExternalProps & {
  placeholderText?: string;
};

export const TextField = ({
  placeholderText,
  ...inputFieldProps
}: TextFieldProps): JSX.Element => (
  <InputField {...inputFieldProps}>
    {({ field, className }: InputRenderProps): JSX.Element => (
      <input
        type="text"
        {...field}
        className={className}
        placeholder={placeholderText}
      />
    )}
  </InputField>
);
