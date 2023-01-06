import { PropsWithChildren, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Typography, TypographyComponent, TextFieldVariant } from 'components';
import styles from './HelperText.module.scss';

type HelperTextProps = {
  variant: TextFieldVariant;
} & PropsWithChildren &
  HTMLAttributes<HTMLElement>;

export const HelperText = ({
  variant = TextFieldVariant.Default,
  children,
}: HelperTextProps): JSX.Element => (
  <Typography
    component={TypographyComponent.Paragraph}
    className={classNames(styles.container, styles[variant])}
  >
    {children}
  </Typography>
);
