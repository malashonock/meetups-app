/* eslint-disable testing-library/no-node-access */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from 'components';

const spiedOnClose = jest.fn();

afterEach(() => {
  // remove all portals manually
  const portals = document.querySelectorAll<HTMLDivElement>(
    'body > div[id$=-root]',
  );
  portals.forEach((portal: HTMLDivElement) =>
    portal.parentNode?.removeChild(portal),
  );

  jest.resetAllMocks();
});

describe('Modal component', () => {
  describe('given show is set to true', () => {
    it('should render the modal', () => {
      render(
        <Modal show onClose={spiedOnClose}>
          Modal content
        </Modal>,
      );

      expect(screen.getByText('Modal content')).toBeInTheDocument();
      expect(document.querySelector('body > #modal-root')).toBeInTheDocument();
    });

    it('on Escape, should call the onClose callback', async () => {
      render(
        <Modal show onClose={spiedOnClose}>
          Modal content
        </Modal>,
      );

      userEvent.keyboard('{Escape}');

      expect(spiedOnClose).toHaveBeenCalled();
    });

    it('on any other key down, should not call the onClose callback', async () => {
      render(
        <Modal show onClose={spiedOnClose}>
          Modal content
        </Modal>,
      );

      userEvent.keyboard('{Space}');

      expect(spiedOnClose).not.toHaveBeenCalled();
    });

    it('on click on the modal overlay, should not call the onClose callback', async () => {
      render(
        <Modal show onClose={spiedOnClose}>
          Modal content
        </Modal>,
      );

      userEvent.click(screen.getByTestId('modal-overlay'));

      expect(spiedOnClose).not.toHaveBeenCalled();
    });
  });

  describe('given show is set to false', () => {
    it('should not render the modal', () => {
      render(
        <Modal show={false} onClose={spiedOnClose}>
          Modal content
        </Modal>,
      );

      expect(screen.queryByText('Modal content')).toBeNull();
      expect(document.querySelector('body > #modal-root')).toBeNull();
    });
  });
});
