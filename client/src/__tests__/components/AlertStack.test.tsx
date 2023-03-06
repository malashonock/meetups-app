import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AlertStack } from 'components';
import { useUiStore } from 'hooks';
import { RootStore, UiStore } from 'stores';
import { Alert, AlertSeverity } from 'types';

// Mock useUiStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useUiStore: jest.fn(),
  };
});
const mockUseUiStore = useUiStore as jest.MockedFunction<typeof useUiStore>;

const mockUiStore = new UiStore(new RootStore());

const mockErrorAlert = new Alert(
  {
    severity: AlertSeverity.Error,
    title: 'Error, something is wrong!',
    text: 'There seems to be a problem',
    expiresIn: 4_000,
  },
  mockUiStore,
);

const mockWarningAlert = new Alert(
  {
    severity: AlertSeverity.Warning,
    title: 'Damn!',
    text: "Something went wrong, but we don't know what exactly",
    expiresIn: 6_000,
  },
  mockUiStore,
);

const mockSuccessAlert = new Alert(
  {
    severity: AlertSeverity.Success,
    title: 'Success!',
    text: "Looks like everything is set up and ready to go! Let's roll!",
    expiresIn: 8_000,
  },
  mockUiStore,
);

const mockInfoAlert = new Alert(
  {
    severity: AlertSeverity.Info,
    title: 'Need help?',
    text: 'Just send us an email with your issue',
    expiresIn: 10_000,
  },
  mockUiStore,
);

const mockAlerts: Alert[] = [
  mockErrorAlert,
  mockWarningAlert,
  mockSuccessAlert,
  mockInfoAlert,
];

// Spy on dismiss() methods of each alert
const spiedOnErrorAlertDismiss = jest.spyOn(mockErrorAlert, 'dismiss');
const spiedOnWarningAlertDismiss = jest.spyOn(mockWarningAlert, 'dismiss');
const spiedOnSuccessAlertDismiss = jest.spyOn(mockSuccessAlert, 'dismiss');
const spiedOnInfoAlertDismiss = jest.spyOn(mockInfoAlert, 'dismiss');

beforeEach(() => {
  mockUseUiStore.mockReturnValue({
    alerts: mockAlerts,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('AlertStack component', () => {
  it('should render the list of alerts', () => {
    render(<AlertStack />);

    expect(screen.getAllByTestId('toast').length).toBe(mockAlerts.length);
  });

  it('on toast close, should call the respective Alert.prototype.dismiss() method', () => {
    render(<AlertStack />);

    userEvent.click(screen.getAllByTestId('btn-close')[0]);

    expect(spiedOnErrorAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnWarningAlertDismiss).toHaveBeenCalledTimes(0);
    expect(spiedOnSuccessAlertDismiss).toHaveBeenCalledTimes(0);
    expect(spiedOnInfoAlertDismiss).toHaveBeenCalledTimes(0);

    userEvent.click(screen.getAllByTestId('btn-close')[1]);

    expect(spiedOnErrorAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnWarningAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnSuccessAlertDismiss).toHaveBeenCalledTimes(0);
    expect(spiedOnInfoAlertDismiss).toHaveBeenCalledTimes(0);

    userEvent.click(screen.getAllByTestId('btn-close')[2]);

    expect(spiedOnErrorAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnWarningAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnSuccessAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnInfoAlertDismiss).toHaveBeenCalledTimes(0);

    userEvent.click(screen.getAllByTestId('btn-close')[3]);

    expect(spiedOnErrorAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnWarningAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnSuccessAlertDismiss).toHaveBeenCalledTimes(1);
    expect(spiedOnInfoAlertDismiss).toHaveBeenCalledTimes(1);
  });
});
