import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toast } from 'components';
import { ComponentProps } from 'react';
import { AlertSeverity } from 'types';

const spiedOnClose = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});

const renderToast = (props?: Partial<ComponentProps<typeof Toast>>): void => {
  render(
    <Toast
      variant={props?.variant || AlertSeverity.Error}
      title={props?.title || 'Error'}
      description={props?.description || 'Something has broken down'}
      onClose={props?.onClose || spiedOnClose}
    />,
  );
};

describe('Toast component', () => {
  it('should render error alert', () => {
    renderToast({
      variant: AlertSeverity.Error,
      title: 'Error',
      description: 'Something has broken down',
    });

    expect(screen.getByTestId('icon-error')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something has broken down')).toBeInTheDocument();
  });

  it('should render warning alert', () => {
    renderToast({
      variant: AlertSeverity.Warning,
      title: 'Warning',
      description: 'There might be a problem',
    });

    expect(screen.getByTestId('icon-warning')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('There might be a problem')).toBeInTheDocument();
  });

  it('should render success alert', () => {
    renderToast({
      variant: AlertSeverity.Success,
      title: 'Success',
      description: 'Mission complete',
    });

    expect(screen.getByTestId('icon-success')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Mission complete')).toBeInTheDocument();
  });

  it('should render info alert', () => {
    renderToast({
      variant: AlertSeverity.Info,
      title: 'Info',
      description: 'Be advised',
    });

    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Be advised')).toBeInTheDocument();
  });

  it('on click on the close button, should call the onClose callback', () => {
    renderToast();

    userEvent.click(screen.getByTestId('btn-close'));

    expect(spiedOnClose).toHaveBeenCalled();
  });
});
