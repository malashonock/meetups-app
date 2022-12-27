import React, { PropsWithChildren, useState } from 'react';
import classNames from 'classnames';

import { Typography, TypographySelector } from 'components';

import styles from './Tooltip.module.scss';

export enum TooltipVariant {
  Dark = 'dark',
  Colored = 'colored',
  Outline = 'outline',
  White = 'white',
}

interface TooltipProps {
  variant?: TooltipVariant;
  title: string;
  description: string;
}

export const Tooltip = ({
  children,
  variant = TooltipVariant.Dark,
  title,
  description,
}: PropsWithChildren<TooltipProps>) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <div
        className={classNames(styles.tooltip, styles[variant], {
          [styles.visible]: visible,
        })}
      >
        <Typography
          variant={TypographySelector.Heading}
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant={TypographySelector.Paragraph}
          className={styles.description}
        >
          {description}
        </Typography>
      </div>
    </div>
  );
};
