import {
  InputFieldExternalProps,
  InputField,
  InputRenderProps,
  TextInput,
  TextArea,
} from 'components';

type TextInputOrAreaProps = {
  placeholderText?: string;
} & ({
  multiline?: false;
} | {
  multiline: true;
  maxCharCount?: number;
});

type TextFieldProps = InputFieldExternalProps & TextInputOrAreaProps;

export const TextField = (props: TextFieldProps): JSX.Element => {
  let placeholderText: string | undefined;
  let inputFieldProps: InputFieldExternalProps;
  let multiline: boolean | undefined;
  let maxCharCount: number | undefined;

  switch (props.multiline) {
    case true:
      ({ placeholderText, multiline, maxCharCount, ...inputFieldProps } = props);

      return (
        <InputField {...inputFieldProps}>
          {({ field, className }: InputRenderProps): JSX.Element => (
            <TextArea
              {...field}
              className={className}
              placeholder={placeholderText}
              maxCharCount={maxCharCount}
            />
          )}
        </InputField>
      );
    case false:
    default:
      ({ placeholderText, ...inputFieldProps } = props);

      return (
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
  }
};