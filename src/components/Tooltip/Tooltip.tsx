import React, { PropsWithChildren, useState } from 'react';
import classNames from 'classnames';

import { Typography } from 'components';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  variant?: 'dark' | 'colored' | 'outline' | 'white';
  title: string;
  description: string;
}

export const Tooltip = ({
  children,
  variant = 'dark',
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
        <Typography variant="heading" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="paragraph" className={styles.description}>
          {description}
        </Typography>
      </div>
    </div>
  );
};
