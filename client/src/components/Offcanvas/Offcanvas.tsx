import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Overlay } from 'components';

import styles from './Offcanvas.module.scss';
import { useOnKeyDown } from 'hooks';

interface OffcanvasProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Offcanvas = ({
  isOpen,
  setIsOpen,
  children,
}: PropsWithChildren<OffcanvasProps>): JSX.Element => {
  const handleOverlayClicked = (): void => {
    setIsOpen(!isOpen);
  };

  useOnKeyDown('Escape', () => setIsOpen(!isOpen));

  return (
    <>
      {isOpen && <Overlay onClick={handleOverlayClicked} />}
      <nav className={classNames(styles.container, { [styles.open]: isOpen })}>
        {children}
      </nav>
    </>
  );
};
