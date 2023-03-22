/* eslint-disable testing-library/no-node-access */

import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmDialog } from 'components';

const spiedOnClose = jest.fn();
const spiedOnConfirm = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

const renderConfirmDialog = (
  props?: Partial<ComponentProps<typeof ConfirmDialog>>,
): void => {
  render(
    <ConfirmDialog
      prompt={props?.prompt || 'Do you really want to delete this?'}
      isOpen={true}
      onConfirm={props?.onConfirm || spiedOnConfirm}
      onClose={props?.onClose || spiedOnClose}
      confirmBtnLabel={props?.confirmBtnLabel}
    />,
  );
};

describe('ConfirmDialog component', () => {
  it('should render itself in a modal', () => {
    renderConfirmDialog();

    expect(document.querySelector('body > #modal-root')).toBeInTheDocument();
  });

  it('should render the prompt text', () => {
    renderConfirmDialog({
      prompt: 'Are you REALLY sure?',
    });

    expect(screen.getByText('Are you REALLY sure?')).toBeInTheDocument();
  });

  describe('OK button', () => {
    it('should render default text', () => {
      renderConfirmDialog();

      const confirmButton = screen.getByTestId('confirm-button');
      expect(confirmButton.textContent).toBe('OK');
    });

    it('should render custom confirm button text', () => {
      renderConfirmDialog({
        confirmBtnLabel: 'No worries bro, go do it',
      });

      const confirmButton = screen.getByTestId('confirm-button');
      expect(confirmButton.textContent).toBe('No worries bro, go do it');
    });

    it('on click, should call the onConfirm, then onClose callback', () => {
      renderConfirmDialog();

      userEvent.click(screen.getByTestId('confirm-button'));

      expect(spiedOnClose).toHaveBeenCalled();
      expect(spiedOnConfirm).toHaveBeenCalled();
    });
  });

  describe('Cancel button', () => {
    it('on click, should call the onClose callback', () => {
      renderConfirmDialog();

      userEvent.click(screen.getByTestId('cancel-button'));

      expect(spiedOnClose).toHaveBeenCalled();
    });
  });
});
