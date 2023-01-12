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
  showCharCounter?: boolean;
});

type TextFieldProps = InputFieldExternalProps & TextInputOrAreaProps;

export const TextField = (props: TextFieldProps): JSX.Element => {
  let placeholderText: string | undefined;
  let inputFieldProps: InputFieldExternalProps;
  let multiline: boolean | undefined;
  let maxCharCount: number | undefined;
  let showCharCounter: boolean | undefined;

  switch (props.multiline) {
    case true:
      ({ placeholderText, multiline, maxCharCount, showCharCounter, ...inputFieldProps } = props);

      return (
        <InputField {...inputFieldProps}>
          {({ field, className }: InputRenderProps): JSX.Element => (
            <TextArea
              {...field}
              className={className}
              placeholder={placeholderText}
              maxCharCount={maxCharCount}
              showCharCounter={showCharCounter}
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