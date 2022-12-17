import React, { PropsWithChildren, useState } from 'react';
import classNames from 'classnames';

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
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
