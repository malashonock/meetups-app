/* eslint-disable testing-library/no-unnecessary-act */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EditNewsPage } from 'pages';
import { NewsFields } from 'model';
import { mockImageWithUrl, mockNewsArticle } from 'model/__fakes__';
import { dropFile } from 'utils';
import { useLocale, useNewsArticle } from 'hooks';
import { Locale, News } from 'stores';

jest.mock('utils/file');

// Mock hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useNewsArticle: jest.fn(),
    useLocale: jest.fn(),
  };
});
const mockUseNewsArticle = useNewsArticle as jest.MockedFunction<
  typeof useNewsArticle
>;
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;
const mockUpdatedNewsArticleUpdate = jest.spyOn(News.prototype, 'update');

beforeEach(() => {
  mockUseNewsArticle.mockReturnValue(mockNewsArticle);
  mockUseLocale.mockReturnValue([Locale.RU, jest.fn()]);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/news/aaa', '/news/aaa/edit']}>
    <Routes>
      <Route path="/news">
        <Route index element={<h1>News page</h1>} />
        <Route path=":id">
          <Route index element={<h1>View news article</h1>} />
          <Route path="edit" element={children} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);

const getTitleInput = () =>
  screen.getByLabelText('formFields.news.title.label');
const getTextInput = () => screen.getByLabelText('formFields.news.text.label');
const getImageDropbox = () => screen.getByTestId('image-dropbox');
const getImagePreview = () => screen.getByTestId('image-preview');
const getImage = () =>
  screen.getByAltText('imagePreview.imgAlt') as HTMLImageElement;
const getSubmitBtn = () => screen.getByText('formButtons.save');
const getCancelBtn = () => screen.getByText('formButtons.cancel');
const getClearImageBtn = () => screen.getByTestId('clear-button');

const mockUpdatedNews: NewsFields = {
  title: 'Updated news title',
  text: 'Updated news text',
  image: mockImageWithUrl,
};

describe('EditNewsPage', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<EditNewsPage />, { wrapper: MockRouter });

    expect(asFragment()).toMatchSnapshot();
  });

  it('on open, should pre-fill form inputs with the current field values', () => {
    render(<EditNewsPage />, { wrapper: MockRouter });

    expect(getTitleInput()).toHaveValue(mockNewsArticle.title);
    expect(getTextInput()).toHaveValue(mockNewsArticle.text);
    expect(getImage().src).toBe(mockNewsArticle.image?.url);
  });

  it('should accept user input', async () => {
    render(<EditNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.clear(getTitleInput());
      userEvent.type(getTitleInput(), mockUpdatedNews.title);
    });
    expect(getTitleInput()).toHaveValue(mockUpdatedNews.title);

    await act(() => {
      userEvent.clear(getTextInput());
      userEvent.type(getTextInput(), mockUpdatedNews.text);
    });
    expect(getTextInput()).toHaveValue(mockUpdatedNews.text);

    await act(() => {
      userEvent.click(getClearImageBtn());
    });
    expect(getImageDropbox()).toBeInTheDocument();

    await act(() => {
      dropFile(getImageDropbox(), mockImageWithUrl);
    });
    expect(getImagePreview()).toBeInTheDocument();
    expect(getImage().src).toBe(mockImageWithUrl.url);
  });

  it('should validate form fields', async () => {
    render(<EditNewsPage />, { wrapper: MockRouter });

    expect(getSubmitBtn()).toBeDisabled();

    await act(() => {
      userEvent.clear(getTitleInput());
      fireEvent.blur(getTitleInput());
    });
    expect(
      screen.getByText('formFields.news.title.errorText'),
    ).toBeInTheDocument();

    await act(() => {
      userEvent.clear(getTextInput());
      fireEvent.blur(getTextInput());
    });
    expect(
      screen.getByText('formFields.news.text.errorText'),
    ).toBeInTheDocument();
  });

  it('should handle form submit', async () => {
    render(<EditNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.clear(getTitleInput());
      userEvent.type(getTitleInput(), mockUpdatedNews.title);
    });

    await act(() => {
      userEvent.clear(getTextInput());
      userEvent.type(getTextInput(), mockUpdatedNews.text);
    });

    await act(() => {
      userEvent.click(getClearImageBtn());
    });

    await act(() => {
      dropFile(getImageDropbox(), mockImageWithUrl);
    });

    await act(() => {
      userEvent.click(getSubmitBtn());
    });

    expect(mockUpdatedNewsArticleUpdate).toHaveBeenCalledWith(mockUpdatedNews);
    expect(screen.getByText('News page')).toBeInTheDocument();
  });

  it('should be able to navigate back to news page', async () => {
    render(<EditNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.click(getCancelBtn());
    });

    expect(screen.getByText('View news article')).toBeInTheDocument();
  });

  it('should render a Loading spinner if news article is undefined', () => {
    mockUseNewsArticle.mockReturnValue(undefined);
    render(<EditNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.newsArticle')).toBeInTheDocument();
  });

  it('should render a Loading spinner while news article is loading', () => {
    const newsArticle = new News(mockNewsArticle);
    newsArticle.isLoading = true;
    mockUseNewsArticle.mockReturnValue(newsArticle);
    render(<EditNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.newsArticle')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading the news article', () => {
    const newsArticle = new News(mockNewsArticle);
    newsArticle.isError = true;
    mockUseNewsArticle.mockReturnValue(newsArticle);
    render(<EditNewsPage />, { wrapper: MockRouter });
    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
