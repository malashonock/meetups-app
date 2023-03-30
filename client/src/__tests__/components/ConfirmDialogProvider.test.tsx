/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */

import { observer } from 'mobx-react-lite';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmDialogContext, ConfirmDialogProvider } from 'components';
import { useContext, useEffect, useState } from 'react';
import { Optional } from 'types';

const TestChildComponent = observer((): JSX.Element => {
  const [choice, setChoice] = useState<Optional<boolean>>();
  const confirm = useContext(ConfirmDialogContext);

  useEffect(() => {
    (async () => {
      const userChoice = await confirm({
        prompt: 'Are you sure you want to delete this?',
      });
      setChoice(userChoice);
    })();
  }, [confirm]);

  return <div data-testid="choice">{JSON.stringify(choice)}</div>;
});

describe('ConfirmDialogProvider', () => {
  it('on call to confirm() function, should render the ConfirmDialog', () => {
    render(
      <ConfirmDialogProvider>
        <TestChildComponent />
      </ConfirmDialogProvider>,
    );

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('choice').textContent).toBe('');
  });

  it('on click on OK button, should return true', async () => {
    render(
      <ConfirmDialogProvider>
        <TestChildComponent />
      </ConfirmDialogProvider>,
    );

    userEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-dialog')).toBeNull();
      expect(screen.getByTestId('choice').textContent).toBe('true');
    });
  });

  it('on click on Cancel button, should return false', async () => {
    render(
      <ConfirmDialogProvider>
        <TestChildComponent />
      </ConfirmDialogProvider>,
    );

    userEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('confirm-dialog')).toBeNull();
      expect(screen.getByTestId('choice').textContent).toBe('false');
    });
  });
});
