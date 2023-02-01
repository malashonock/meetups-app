import React, { PropsWithChildren, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import { Typography, TypographyComponent } from 'components';

import styles from './Tooltip.module.scss';

export enum TooltipVariant {
  Dark = 'dark',
  Colored = 'colored',
  Outline = 'outline',
  White = 'white',
}

export enum TooltipPosition {
  TopLeft = 'top-left',
  TopCenter = 'top-center',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomCenter = 'bottom-center',
  BottomRight = 'bottom-right',
}

interface TooltipProps {
  variant?: TooltipVariant;
  position?: TooltipPosition;
  title: string;
  description: string;
}

const resetOffsetX = (): void => {
  const tooltip = document.querySelector<HTMLDivElement>(`.${styles.tooltip}`);
  const content = document.querySelector<HTMLDivElement>(`.${styles.content}`);
  if (tooltip && content) {
    const tooltipWidth: number = tooltip.clientWidth;
    const contentWidth: number = content.clientWidth;
    const paddingX = 25; // px
    const offsetX: number = Math.max(
      paddingX,
      Math.min(contentWidth / 2, tooltipWidth / 2),
    );
    tooltip.style.setProperty('--offset-x', `${offsetX}px`);
  }
};

export const Tooltip = ({
  children,
  variant = TooltipVariant.Dark,
  position = TooltipPosition.BottomCenter,
  title,
  description,
}: PropsWithChildren<TooltipProps>) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  useLayoutEffect(() => {
    resetOffsetX();
  }, [children]);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      <div className={styles.content}>{children}</div>
      <div
        className={classNames(
          styles.tooltip,
          styles[variant],
          styles[position],
          { [styles.visible]: visible },
        )}
      >
        <Typography
          component={TypographyComponent.Heading3}
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.description}
        >
          {description}
        </Typography>
      </div>
    </div>
  );
};
