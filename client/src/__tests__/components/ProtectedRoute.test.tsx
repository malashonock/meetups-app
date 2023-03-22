import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ProtectedRoute, RedirectCondition, RootContext } from 'components';
import { mockFullUser, mockFullUser2 } from 'model/__fakes__';
import { useAuthStore } from 'hooks';
import { AlertSeverity } from 'types';
import { RootStore } from 'stores';

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

beforeEach(() => {
  const { authStore } = new RootStore();
  authStore.loggedUser = null;
  authStore.isInitialized = true;
  mockUseAuthStore.mockReturnValue(authStore);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/protected']}>
    <Routes>
      <Route path="/" element={<h1>Home page</h1>} />
      <Route path="/login" element={<h1>Login page</h1>} />
      <Route path="/meetups" element={<h1>Meetups page</h1>} />
      <Route path="/news" element={<h1>News page</h1>} />
      <Route path="/protected" element={children} />
    </Routes>
  </MemoryRouter>
);

const mockRootStore = new RootStore();
const spiedOnRootStoreOnAlert = jest.fn();
mockRootStore.onAlert = spiedOnRootStoreOnAlert;

const MockRouterWithRootStoreProvider = ({
  children,
}: PropsWithChildren): JSX.Element => (
  <RootContext.Provider value={mockRootStore}>
    <MockRouter>{children}</MockRouter>
  </RootContext.Provider>
);

const ProtectedPage = (): JSX.Element => <h1>Protected page</h1>;

describe('ProtectedRoute', () => {
  describe('if redirectIf is set to "unauthenticated" or omitted', () => {
    it('if a user is logged in, navigates to the protected route', () => {
      const { authStore } = new RootStore();
      authStore.loggedUser = mockFullUser;
      authStore.isInitialized = true;
      mockUseAuthStore.mockReturnValue(authStore);

      render(
        <ProtectedRoute>
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockRouter,
        },
      );

      const protectedPage = screen.queryByText('Protected page');
      expect(protectedPage).toBeInTheDocument();
    });

    describe('if no user is logged in', () => {
      it('if redirectTo is omitted, redirects to login page', () => {
        render(
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const loginPage = screen.queryByText('Login page');
        expect(loginPage).toBeInTheDocument();
      });

      it('if redirectTo is specified, redirects to the specified route', () => {
        render(
          <ProtectedRoute redirectTo="/news">
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });

      it('should push an error alert to the root store alerts', () => {
        render(
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouterWithRootStoreProvider,
          },
        );

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('if redirectIf is set to "nonAdmin"', () => {
    it('if a user with admin rights is logged in, navigates to the protected route', () => {
      const { authStore } = new RootStore();
      authStore.loggedUser = mockFullUser;
      authStore.isInitialized = true;
      mockUseAuthStore.mockReturnValue(authStore);

      render(
        <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockRouter,
        },
      );

      const protectedPage = screen.queryByText('Protected page');
      expect(protectedPage).toBeInTheDocument();
    });

    describe('if a user with non-admin-rights is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = mockFullUser2;
        authStore.isInitialized = true;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('if redirectTo is omitted, redirects to login page', () => {
        render(
          <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const loginPage = screen.queryByText('Login page');
        expect(loginPage).toBeInTheDocument();
      });

      it('if redirectTo is specified, redirects to the specified route', () => {
        render(
          <ProtectedRoute
            redirectIf={RedirectCondition.NonAdmin}
            redirectTo="/news"
          >
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });

      it('should push an error alert to the root store alerts', () => {
        render(
          <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouterWithRootStoreProvider,
          },
        );

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });

    describe('if no user is logged in', () => {
      it('if redirectTo is omitted, redirects to login page', () => {
        render(
          <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const loginPage = screen.queryByText('Login page');
        expect(loginPage).toBeInTheDocument();
      });

      it('if redirectTo is specified, redirects to the specified route', () => {
        render(
          <ProtectedRoute
            redirectIf={RedirectCondition.NonAdmin}
            redirectTo="/news"
          >
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });

      it('should push an error alert to the root store alerts', () => {
        render(
          <ProtectedRoute redirectIf={RedirectCondition.NonAdmin}>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouterWithRootStoreProvider,
          },
        );

        expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
        expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
          AlertSeverity.Error,
        );
      });
    });
  });

  describe('if redirectIf is set to "authenticated"', () => {
    it('if no user is logged in, navigates to the protected route', () => {
      render(
        <ProtectedRoute redirectIf={RedirectCondition.Authenticated}>
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockRouter,
        },
      );

      const protectedPage = screen.queryByText('Protected page');
      expect(protectedPage).toBeInTheDocument();
    });

    describe('if a user is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = mockFullUser;
        authStore.isInitialized = true;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('if redirectTo is omitted, redirects to meetups page', () => {
        render(
          <ProtectedRoute redirectIf={RedirectCondition.Authenticated}>
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const meetupsPage = screen.queryByText('Meetups page');
        expect(meetupsPage).toBeInTheDocument();
      });

      it('if redirectTo is specified, redirects to the specified route', () => {
        render(
          <ProtectedRoute
            redirectIf={RedirectCondition.Authenticated}
            redirectTo="/news"
          >
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });
    });
  });

  describe('given authStore is not initialized', () => {
    it('should render a loading spinner', () => {
      const { authStore } = new RootStore();
      authStore.loggedUser = null;
      authStore.isInitialized = false;
      mockUseAuthStore.mockReturnValue(authStore);

      render(
        <ProtectedRoute>
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockRouter,
        },
      );

      expect(screen.getByText('loadingText.default')).toBeInTheDocument();
    });
  });
});
