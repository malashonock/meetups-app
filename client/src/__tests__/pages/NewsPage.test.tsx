/* eslint-disable testing-library/no-node-access */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NewsPage } from 'pages';
import { useLocale, useNewsStore } from 'hooks';
import { generateNews } from 'model/__fakes__';
import { Locale, RootStore } from 'stores';

const NEWS_COUNT = 12;

const mockNews = generateNews(NEWS_COUNT);

// Mock hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useNewsStore: jest.fn(),
    useLocale: jest.fn(),
  };
});
const mockUseNewsStore = useNewsStore as jest.MockedFunction<
  typeof useNewsStore
>;
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

beforeEach(() => {
  const { newsStore } = new RootStore();
  newsStore.news = mockNews;
  mockUseNewsStore.mockReturnValue(newsStore);

  mockUseLocale.mockReturnValue([Locale.RU, jest.fn()]);
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

  it('should render a Loading spinner while news are loading', () => {
    const { newsStore } = new RootStore();
    newsStore.isLoading = true;
    mockUseNewsStore.mockReturnValue(newsStore);

    render(<NewsPage />, { wrapper: MockRouter });

    expect(screen.getByText('loadingText.news')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading news', () => {
    const { newsStore } = new RootStore();
    newsStore.isError = true;
    mockUseNewsStore.mockReturnValue(newsStore);

    render(<NewsPage />, { wrapper: MockRouter });

    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
