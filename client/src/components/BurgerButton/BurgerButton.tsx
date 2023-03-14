import { useState } from 'react';
import classNames from 'classnames';

import styles from './BurgerButton.module.scss';

interface BurgerButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const BurgerButton = ({
  isOpen,
  setIsOpen,
}: BurgerButtonProps): JSX.Element => {
  return (
    <button
      className={classNames(styles.wrapper, { [styles.open]: isOpen })}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={classNames(styles.line, styles.line1)} />
      <div className={classNames(styles.line, styles.line2)} />
      <div className={classNames(styles.line, styles.line3)} />
    </button>
  );
};
