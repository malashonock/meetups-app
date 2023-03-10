/* eslint-disable testing-library/no-node-access */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NewsPage } from 'pages';
import { useAuthStore, useNewsStore } from 'hooks';
import { generateNews, mockFullUser, mockFullUser2 } from 'model/__fakes__';

const NEWS_COUNT = 12;

const mockNews = generateNews(NEWS_COUNT);

// Mock useNewsStore & useAuthStore hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useNewsStore: jest.fn(),
    useAuthStore: jest.fn(),
  };
});
const mockUseNewsStore = useNewsStore as jest.MockedFunction<
  typeof useNewsStore
>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

beforeEach(() => {
  mockUseNewsStore.mockReturnValue({
    news: mockNews,
    isLoading: false,
    isError: false,
    errors: [],
  });
  mockUseAuthStore.mockReturnValue({
    loggedUser: mockFullUser,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/news']}>
    <Routes>
      <Route path="/news">
        <Route index element={children} />
        <Route path="create" element={<h1>Create news article</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('NewsPage', () => {
  it('renders the list of news cards correctly', () => {
    render(<NewsPage />, { wrapper: MockRouter });

    const newsCards = screen.getAllByTestId('news-card');
    expect(newsCards).toHaveLength(NEWS_COUNT);

    const renderedTitles = newsCards.map(
      (element) => element.querySelector('.title')?.textContent,
    );
    const expectedTitles = mockNews.map((news) => news.title);
    expect(renderedTitles).toEqual(expectedTitles);
  });

  describe('Create news button', () => {
    describe('given a user with admin rights is logged in', () => {
      it('on click, navigates to /news/create route', () => {
        render(<NewsPage />, { wrapper: MockRouter });

        userEvent.click(screen.getByText('newsPage.createNewsBtn'));
        expect(screen.getByText('Create news article')).toBeInTheDocument();
      });
    });

    describe('given a user with non-admin rights is logged in', () => {
      it('should not be rendered', () => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser2,
        });

        render(<NewsPage />, { wrapper: MockRouter });

        expect(screen.queryByText('newsPage.createNewsBtn')).toBeNull();
      });
    });

    describe('given no user is logged in', () => {
      it('should not be rendered', () => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: null,
        });

        render(<NewsPage />, { wrapper: MockRouter });

        expect(screen.queryByText('newsPage.createNewsBtn')).toBeNull();
      });
    });
  });

  it('should render a Loading spinner if news are undefined', () => {
    mockUseNewsStore.mockReturnValue({});
    render(<NewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.news')).toBeInTheDocument();
  });

  it('should render a Loading spinner while news are loading', () => {
    mockUseNewsStore.mockReturnValue({
      news: mockNews,
      isLoading: true,
    });
    render(<NewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.news')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading news', () => {
    mockUseNewsStore.mockReturnValue({
      news: mockNews,
      isError: true,
    });
    render(<NewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
