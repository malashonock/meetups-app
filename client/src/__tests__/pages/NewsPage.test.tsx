/* eslint-disable testing-library/no-node-access */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NewsPage } from 'pages';
import { useNewsStore } from 'hooks';
import { generateNews } from 'model/__fakes__';

const NEWS_COUNT = 12;

const mockNews = generateNews(NEWS_COUNT);

// Mock useNewsStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useNewsStore: jest.fn(),
  };
});
const mockUseNewsStore = useNewsStore as jest.MockedFunction<
  typeof useNewsStore
>;

beforeEach(() => {
  mockUseNewsStore.mockReturnValue({
    news: mockNews,
    isLoading: false,
    isError: false,
    errors: [],
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
    it('on click, navigates to /news/create route', () => {
      render(<NewsPage />, { wrapper: MockRouter });

      userEvent.click(screen.getByText('newsPage.createNewsBtn'));
      expect(screen.getByText('Create news article')).toBeInTheDocument();
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
