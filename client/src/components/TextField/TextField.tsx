import {
  InputFieldExternalProps,
  InputField,
  InputRenderProps,
  TextInput,
  TextArea,
} from 'components';

type TextInputOrAreaProps = {
  placeholderText?: string;
  containerAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
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
  let containerAttributes: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> | undefined;
  let inputFieldProps: InputFieldExternalProps;
  let multiline: boolean | undefined;
  let maxCharCount: number | undefined;
  let showCharCounter: boolean | undefined;

  switch (props.multiline) {
    case true:
      ({ placeholderText, containerAttributes, multiline, maxCharCount, showCharCounter, ...inputFieldProps } = props);

      return (
        <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
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
      ({ placeholderText, containerAttributes, ...inputFieldProps } = props);

      return (
        <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
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