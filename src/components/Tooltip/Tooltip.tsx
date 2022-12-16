import React, { PropsWithChildren, useState } from 'react';
import classNames from 'classnames';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  variant?: 'dark' | 'colored' | 'outline' | 'white';
  heading: string;
  description: string;
}

function Tooltip({
  children,
  variant = 'dark',
  heading,
  description,
}: PropsWithChildren<TooltipProps>) {
  const [visible, setVisible] = useState(true);

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
        <h6 className={styles.heading}>{heading}</h6>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default Tooltip;
