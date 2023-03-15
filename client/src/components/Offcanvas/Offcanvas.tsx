import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Overlay } from 'components';

import styles from './Offcanvas.module.scss';

interface OffcanvasProps {
  isOpen: boolean;
}

export const Offcanvas = ({
  isOpen,
  children,
}: PropsWithChildren<OffcanvasProps>): JSX.Element => {
  return (
    <>
      {isOpen && <Overlay />}
      <nav className={classNames(styles.container, { [styles.open]: isOpen })}>
        {children}
      </nav>
    </>
  );
};
