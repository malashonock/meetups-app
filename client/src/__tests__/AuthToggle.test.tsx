import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthToggle } from 'components';
import { UserRole } from 'model';
import { RootStore, User } from 'stores';

// Mock useAuthStore hook
import { useAuthStore } from 'hooks/useAuthStore';
jest.mock('hooks/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

// Mock useTranslation hook;
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

const MockLoginRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/somepage']}>
    <Routes>
      <Route path="/" element={<h1>Home page</h1>} />
      <Route path="/login" element={<h1>Login page</h1>} />
      <Route path="/somepage" element={children} />
    </Routes>
  </MemoryRouter>
);

describe('AuthToggle', () => {
  describe('if no user is authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: null,
      });
    });

    it('on click, redirects to login page', async () => {
      render(<AuthToggle />, { wrapper: MockLoginRouter });

      const loginButton = screen.getByLabelText('login-button');
      expect(loginButton).toBeInTheDocument();

      userEvent.click(loginButton);

      const loginPage = await screen.findByText('Login page');
      expect(loginPage).toBeInTheDocument();
    });

    it('on hover, shows tooltip with login prompt', async () => {
      render(<AuthToggle />, { wrapper: MockLoginRouter });

      const loginButton = screen.getByLabelText('login-button');
      expect(loginButton).toBeInTheDocument();

      userEvent.hover(loginButton);

      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();

      const tooltipTitle = screen.getByText('loginTooltip.title');
      expect(tooltipTitle).toBeInTheDocument();

      const tooltipText = screen.getByText('loginTooltip.text');
      expect(tooltipText).toBeInTheDocument();
    });
  });

  describe('if a user is authenticated', () => {
    const mockedLogout = jest.fn();

    beforeEach(() => {
      const mockedLoggedUser = new User({
        id: 'aaa',
        name: 'John',
        surname: 'Doe',
        post: 'Software Engineer',
        roles: UserRole.EMPLOYEE,
      });

      mockUseAuthStore.mockReturnValue({
        loggedUser: mockedLoggedUser,
        authStore: {
          rootStore: new RootStore(),
          loggedUser: mockedLoggedUser,
          logIn: jest.fn(),
          logOut: mockedLogout,
        },
      });
    });

    it("on click, calls the auth store's logout function and redirects to home page", async () => {
      render(<AuthToggle />, { wrapper: MockLoginRouter });

      const logoutButton = screen.getByLabelText('logout-button');
      expect(logoutButton).toBeInTheDocument();

      userEvent.click(logoutButton);

      expect(mockedLogout).toBeCalledTimes(1);

      const homePage = await screen.findByText('Home page');
      expect(homePage).toBeInTheDocument();
    });

    it('on hover, shows tooltip with logout prompt', async () => {
      render(<AuthToggle />, { wrapper: MockLoginRouter });

      const logoutButton = screen.getByLabelText('logout-button');
      expect(logoutButton).toBeInTheDocument();

      userEvent.hover(logoutButton);

      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();

      const tooltipTitle = screen.getByText('logoutTooltip.title');
      expect(tooltipTitle).toBeInTheDocument();

      const tooltipText = screen.getByText('logoutTooltip.text');
      expect(tooltipText).toBeInTheDocument();
    });
  });
});
