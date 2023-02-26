import { HTMLInputTypeAttribute } from 'react';

import {
  InputFieldExternalProps,
  InputField,
  InputRenderProps,
  TextInput,
  TextArea,
} from 'components';
import { Optional } from 'types';

type TextInputOrAreaProps = {
  placeholderText?: string;
  containerAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
} & (
  | {
      multiline?: false;
      type?: HTMLInputTypeAttribute;
    }
  | {
      multiline: true;
      maxCharCount?: number;
      showCharCounter?: boolean;
    }
);

type TextFieldProps = InputFieldExternalProps & TextInputOrAreaProps;

export const TextField = (props: TextFieldProps): JSX.Element => {
  let placeholderText: Optional<string>;
  let containerAttributes:
    | Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
    | undefined;
  let inputFieldProps: InputFieldExternalProps;
  let type: Optional<string>;
  let multiline: Optional<boolean>;
  let maxCharCount: Optional<number>;
  let showCharCounter: Optional<boolean>;

  switch (props.multiline) {
    case true:
      ({
        placeholderText,
        containerAttributes,
        multiline,
        maxCharCount,
        showCharCounter,
        ...inputFieldProps
      } = props);

      return (
        <InputField
          containerAttributes={containerAttributes}
          {...inputFieldProps}
        >
          {({ field, className }: InputRenderProps): JSX.Element => (
            <TextArea
              {...field}
              id={field.name}
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
      ({ placeholderText, type, containerAttributes, ...inputFieldProps } =
        props);

      return (
        <InputField
          containerAttributes={containerAttributes}
          {...inputFieldProps}
        >
          {({ field, className }: InputRenderProps): JSX.Element => (
            <TextInput
              {...field}
              type={type ?? 'text'}
              id={field.name}
              className={className}
              placeholder={placeholderText}
            />
          )}
        </InputField>
      );
  }
};
