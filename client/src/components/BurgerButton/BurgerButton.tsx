import { useState } from 'react';
import classNames from 'classnames';

import styles from './BurgerButton.module.scss';

export const BurgerButton = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prevState: boolean) => !prevState);

  return (
    <button
      className={classNames(styles.wrapper, { [styles.open]: isOpen })}
      onClick={toggleOpen}
    >
      <div className={classNames(styles.line, styles.line1)} />
      <div className={classNames(styles.line, styles.line2)} />
      <div className={classNames(styles.line, styles.line3)} />
    </button>
  );
};
