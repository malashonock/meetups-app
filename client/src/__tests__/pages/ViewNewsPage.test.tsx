import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ViewNewsPage } from 'pages';
import { mockFullUser, mockNewsArticle } from 'model/__fakes__';
import { useAuthStore, useNewsArticle } from 'hooks';
import { News, RootStore } from 'stores';

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
  const { authStore } = new RootStore();
  authStore.loggedUser = mockFullUser;
  mockUseAuthStore.mockReturnValue(authStore);

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

  describe('Back button', () => {
    it('on click, should navigate to previous page', async () => {
      render(<ViewNewsPage />, { wrapper: MockRouter });
      userEvent.click(screen.getByText('formButtons.back'));
      expect(screen.getByText('News page')).toBeInTheDocument();
    });
  });

  describe('Edit News button', () => {
    describe('given no user is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = null;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('should not be rendered', () => {
        render(<ViewNewsPage />, { wrapper: MockRouter });
        expect(screen.queryByText('formButtons.edit')).toBeNull();
      });
    });

    describe('given a user is logged in', () => {
      it('on click, should redirect to Edit News page', async () => {
        render(<ViewNewsPage />, { wrapper: MockRouter });
        userEvent.click(screen.getByText('formButtons.edit'));
        expect(screen.getByText('Edit news article')).toBeInTheDocument();
      });
    });
  });

  it('should render a Loading spinner if news article is undefined', () => {
    mockUseNewsArticle.mockReturnValue(undefined);
    render(<ViewNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.newsArticle')).toBeInTheDocument();
  });

  it('should render a Loading spinner while news article is loading', () => {
    const newsArticle = new News(mockNewsArticle);
    newsArticle.isLoading = true;
    mockUseNewsArticle.mockReturnValue(newsArticle);
    render(<ViewNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.newsArticle')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading the news article', () => {
    const newsArticle = new News(mockNewsArticle);
    newsArticle.isError = true;
    mockUseNewsArticle.mockReturnValue(newsArticle);
    render(<ViewNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
