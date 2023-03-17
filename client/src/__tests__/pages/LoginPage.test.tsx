/* eslint-disable testing-library/no-unnecessary-act */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginPage } from 'pages';
import { useAuthStore, useLocale } from 'hooks';
import { AuthStore, Locale, RootStore } from 'stores';
import { Credentials } from 'model';

// Mock hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useLocale: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

const spiedOnAuthStoreLogIn = jest.spyOn(AuthStore.prototype, 'logIn');

beforeEach(() => {
  const { authStore } = new RootStore();
  authStore.loggedUser = null;
  mockUseAuthStore.mockReturnValue(authStore);

  mockUseLocale.mockReturnValue([Locale.RU, jest.fn()]);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/', '/login']}>
    <Routes>
      <Route path="/">
        <Route index element={<h1>Home page</h1>} />
        <Route path="login" element={children} />
        <Route path="meetups" element={<h1>Meetups page</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const getUserNameInput = () =>
  screen.getByLabelText('formFields.login.username.label');
const getPasswordInput = () =>
  screen.getByLabelText('formFields.login.password.label');
const getLoginBtn = () => screen.getByText('formButtons.login');

const mockCredentials: Credentials = {
  username: 'John',
  password: 'sweethomealabama',
};

describe('LoginPage', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<LoginPage />, { wrapper: MockRouter });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should open a blank form', () => {
    render(<LoginPage />, { wrapper: MockRouter });

    expect(getUserNameInput()).toHaveValue('');
    expect(getPasswordInput()).toHaveValue('');
  });

  it('should accept user input', async () => {
    render(<LoginPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.type(getUserNameInput(), mockCredentials.username);
    });
    expect(getUserNameInput()).toHaveValue(mockCredentials.username);

    await act(() => {
      userEvent.type(getPasswordInput(), mockCredentials.password);
    });
    expect(getPasswordInput()).toHaveValue(mockCredentials.password);
  });

  it('should validate form fields', async () => {
    render(<LoginPage />, { wrapper: MockRouter });

    expect(getLoginBtn()).toBeDisabled();

    await act(() => {
      fireEvent.blur(getUserNameInput());
    });
    expect(
      screen.getByText('formFields.login.username.errorText'),
    ).toBeInTheDocument();

    await act(() => {
      fireEvent.blur(getPasswordInput());
    });
    expect(
      screen.getByText('formFields.login.password.errorText'),
    ).toBeInTheDocument();
  });

  it('should handle form submit', async () => {
    render(<LoginPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.type(getUserNameInput(), mockCredentials.username);
      userEvent.type(getPasswordInput(), mockCredentials.password);
    });

    await act(() => {
      userEvent.click(getLoginBtn());
    });

    expect(spiedOnAuthStoreLogIn).toHaveBeenCalledWith(mockCredentials);
    expect(screen.getByText('Meetups page')).toBeInTheDocument();
  });
});
