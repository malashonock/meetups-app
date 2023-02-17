import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ViewNewsPage } from 'pages';
import { mockNewsArticle, mockUser } from 'model/__fakes__';
import { useAuthStore, useNewsArticle } from 'hooks';

jest.mock('utils/file');

// Mock useAuthStore & useNewsArticle hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useNewsArticle: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseNewsArticle = useNewsArticle as jest.MockedFunction<
  typeof useNewsArticle
>;

beforeEach(() => {
  mockUseAuthStore.mockReturnValue({
    loggedUser: mockUser,
  });
  mockUseNewsArticle.mockReturnValue(mockNewsArticle);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/news', '/news/aaa']}>
    <Routes>
      <Route path="/news">
        <Route index element={<h1>News page</h1>} />
        <Route path=":id">
          <Route index element={children} />
          <Route path="edit" element={<h1>Edit news article</h1>} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('ViewNewsPage', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<ViewNewsPage />, { wrapper: MockRouter });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should be able to navigate back to news page', async () => {
    render(<ViewNewsPage />, { wrapper: MockRouter });

    userEvent.click(screen.getByText('formButtons.back'));

    expect(screen.getByText('News page')).toBeInTheDocument();
  });

  describe('Edit News button', () => {
    it('should not be rendered if no user is logged in', () => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: null,
      });

      render(<ViewNewsPage />, { wrapper: MockRouter });

      expect(screen.queryByText('formButtons.edit')).toBeNull();
    });

    it('if a user is logged in, should redirect to Edit News page', async () => {
      render(<ViewNewsPage />, { wrapper: MockRouter });

      expect(screen.getByText('formButtons.back')).toBeInTheDocument();

      userEvent.click(screen.getByText('formButtons.edit'));

      expect(screen.getByText('Edit news article')).toBeInTheDocument();
    });
  });

  it('should render a Not Found page if useNewsArticle returns undefined', () => {
    mockUseNewsArticle.mockReturnValue(undefined);

    render(<ViewNewsPage />, { wrapper: MockRouter });

    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
