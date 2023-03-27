import { useState } from 'react';
import classNames from 'classnames';

import styles from './BurgerButton.module.scss';

interface BurgerButtonProps {
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const BurgerButton = ({
  isOpen,
  onToggleOpen,
}: BurgerButtonProps): JSX.Element => {
  return (
    <button
      className={classNames(styles.wrapper, { [styles.open]: isOpen })}
      onClick={onToggleOpen}
    >
      <div className={classNames(styles.line, styles.line1)} />
      <div className={classNames(styles.line, styles.line2)} />
      <div className={classNames(styles.line, styles.line3)} />
    </button>
  );
};
