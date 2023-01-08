import { PropsWithChildren, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Typography, TypographyComponent, TextFieldVariant } from 'components';
import styles from './HelperText.module.scss';

type HelperTextProps = {
  variant: TextFieldVariant;
} & PropsWithChildren &
  HTMLAttributes<HTMLParagraphElement>;

export const HelperText = ({
  variant = TextFieldVariant.Default,
  children,
  ...nativeHtmlProps
}: HelperTextProps): JSX.Element => (
  <Typography
    component={TypographyComponent.Paragraph}
    {...nativeHtmlProps}
    className={classNames(
      nativeHtmlProps.className,
      styles.container,
      styles[variant],
    )}
  >
    {children}
  </Typography>
);
