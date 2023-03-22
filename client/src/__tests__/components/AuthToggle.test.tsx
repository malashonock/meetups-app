import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthToggle } from 'components';
import { AuthStore, RootStore, UserStore } from 'stores';
import { mockFullUser as mockedLoggedUser } from 'model/__fakes__';
import { useAuthStore } from 'hooks';

// Mock useAuthStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

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
      const { authStore } = new RootStore();
      authStore.loggedUser = null;
      mockUseAuthStore.mockReturnValue(authStore);
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
    const spiedOnAuthStoreLogOut = jest.spyOn(AuthStore.prototype, 'logOut');

    beforeEach(() => {
      const { authStore } = new RootStore();
      authStore.loggedUser = mockedLoggedUser;
      mockUseAuthStore.mockReturnValue(authStore);
    });

    it("on click, calls the auth store's logout function and redirects to home page", async () => {
      render(<AuthToggle />, { wrapper: MockLoginRouter });

      const logoutButton = screen.getByLabelText('logout-button');
      expect(logoutButton).toBeInTheDocument();

      userEvent.click(logoutButton);

      expect(spiedOnAuthStoreLogOut).toHaveBeenCalledTimes(1);

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
