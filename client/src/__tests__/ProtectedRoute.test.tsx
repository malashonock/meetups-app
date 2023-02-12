import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from 'components';
import { mockUser as mockedLoggedUser } from 'model/__fakes__';
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

beforeEach(() => {
  mockUseAuthStore.mockReturnValue({
    loggedUser: null,
  });
});

const MockLoginRouter = ({ children }: PropsWithChildren): JSX.Element => (
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

const ProtectedPage = (): JSX.Element => <h1>Protected page</h1>;

describe('ProtectedRoute', () => {
  describe('if redirectIf is set to "unauthenticated" or omitted', () => {
    it('if a user is logged in, navigates to the protected route', () => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockedLoggedUser,
      });

      render(
        <ProtectedRoute>
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockLoginRouter,
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
            wrapper: MockLoginRouter,
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
            wrapper: MockLoginRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });
    });
  });

  describe('if redirectIf is set to "authenticated"', () => {
    it('if no user is logged in, navigates to the protected route', () => {
      render(
        <ProtectedRoute redirectIf="authenticated">
          <ProtectedPage />
        </ProtectedRoute>,
        {
          wrapper: MockLoginRouter,
        },
      );

      const protectedPage = screen.queryByText('Protected page');
      expect(protectedPage).toBeInTheDocument();
    });

    describe('if a user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockedLoggedUser,
        });
      });

      it('if redirectTo is omitted, redirects to meetups page', () => {
        render(
          <ProtectedRoute redirectIf="authenticated">
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockLoginRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const meetupsPage = screen.queryByText('Meetups page');
        expect(meetupsPage).toBeInTheDocument();
      });

      it('if redirectTo is specified, redirects to the specified route', () => {
        render(
          <ProtectedRoute redirectIf="authenticated" redirectTo="/news">
            <ProtectedPage />
          </ProtectedRoute>,
          {
            wrapper: MockLoginRouter,
          },
        );

        const protectedPage = screen.queryByText('Protected page');
        expect(protectedPage).toBeNull();

        const newsPage = screen.queryByText('News page');
        expect(newsPage).toBeInTheDocument();
      });
    });
  });
});
