import styles from './InputText.module.scss';

import classNames from 'classnames';

type InputTextProps = {
  variant: 'error' | 'success' | false;
  placeholder?: string;
  value: string;
  type: string;
  field: object;
};

export const InputText = ({
  variant,
  placeholder,
  value,
  field,
}: InputTextProps): JSX.Element => {
  return (
    <input
      className={classNames(styles.input, variant && styles[variant])}
      {...field}
      type="text"
      value={value}
      placeholder={placeholder}
    />
  );
};
