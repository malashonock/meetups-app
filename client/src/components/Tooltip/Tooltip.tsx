import { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Typography, TypographyComponent } from 'components';
import { Nullable } from 'types';
import { isElementDisplayed } from 'utils';

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
  description?: Nullable<string>;
}

export const Tooltip = ({
  children,
  variant = TooltipVariant.Dark,
  position = TooltipPosition.BottomCenter,
  title,
  description,
}: PropsWithChildren<TooltipProps>) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  const isDisplayed = wrapperRef.current
    ? isElementDisplayed<HTMLDivElement>(wrapperRef.current)
    : false;

  const resetOffsetX = (): void => {
    const tooltip = wrapperRef.current?.querySelector<HTMLDivElement>(
      `.${styles.tooltip}`,
    );
    const content = wrapperRef.current?.querySelector<HTMLDivElement>(
      `.${styles.content}`,
    );
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

  useLayoutEffect(() => {
    resetOffsetX();
  }, [isDisplayed]);

  return (
    <div
      ref={wrapperRef}
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
        role="tooltip"
      >
        <Typography
          component={TypographyComponent.Heading3}
          className={styles.title}
        >
          {title}
        </Typography>
        {!!description && (
          <Typography
            component={TypographyComponent.Paragraph}
            className={styles.description}
          >
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};
