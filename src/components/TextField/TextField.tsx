import {
  InputFieldExternalProps,
  InputField,
  InputRenderProps,
  TextInput,
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
      <TextInput
        {...field}
        className={className}
        placeholder={placeholderText}
      />
    )}
  </InputField>
);
