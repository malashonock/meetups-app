import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Typography, TypographyComponent } from 'components';
import styles from './HelperText.module.scss';

export enum HelperTextVariant {
  Error = 'error',
  Success = 'success',
  Default = 'default',
}

type HelperTextProps = {
  variant: HelperTextVariant;
} & PropsWithChildren;

export const HelperText = ({
  variant = HelperTextVariant.Default,
  children,
}: HelperTextProps): JSX.Element => (
  <Typography
    component={TypographyComponent.Paragraph}
    className={classNames(styles.container, styles[variant])}
  >
    {children}
  </Typography>
);
