import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Overlay } from 'components';

import styles from './Offcanvas.module.scss';
import { useOnKeyDown } from 'hooks';

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Offcanvas = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<OffcanvasProps>): JSX.Element => {
  useOnKeyDown('Escape', onClose);

  return (
    <>
      {isOpen && <Overlay onClick={onClose} zIndex={9} />}
      <nav className={classNames(styles.container, { [styles.open]: isOpen })}>
        {children}
      </nav>
    </>
  );
};
