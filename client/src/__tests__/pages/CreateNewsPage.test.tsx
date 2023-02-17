/* eslint-disable testing-library/no-unnecessary-act */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateNewsPage } from 'pages';
import { NewsFields } from 'model';
import { mockImageWithUrl } from 'model/__fakes__';
import { dropFile } from 'utils';
import { useNewsStore } from 'hooks';
import { RootStore } from 'stores';

jest.mock('utils/file');

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
const mockNewsStoreCreateArticle = jest.fn();

beforeEach(() => {
  mockUseNewsStore.mockReturnValue({
    newsStore: {
      rootStore: new RootStore(),
      news: [],
      loadNews: jest.fn(),
      createNewsArticle: mockNewsStoreCreateArticle,
      findNewsArticle: jest.fn(),
      onNewsArticleDeleted: jest.fn(),
    },
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/news', '/news/create']}>
    <Routes>
      <Route path="/news">
        <Route index element={<h1>News page</h1>} />
        <Route path="create" element={children} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const getTitleInput = () =>
  screen.getByLabelText('formFields.news.title.label');
const getTextInput = () => screen.getByLabelText('formFields.news.text.label');
const getImageInput = () =>
  screen.getByLabelText('formFields.news.image.label') as HTMLInputElement;
const getImageDropbox = () => screen.getByTestId('image-dropbox');
const getImagePreview = () => screen.getByTestId('image-preview');
const getImage = () =>
  screen.getByAltText('imagePreview.imgAlt') as HTMLImageElement;
const getSubmitBtn = () => screen.getByText('formButtons.create');
const getBackBtn = () => screen.getByText('formButtons.back');

const mockNews: NewsFields = {
  title: 'News title',
  text: 'News text',
  image: mockImageWithUrl,
};

describe('CreateNewsPage', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<CreateNewsPage />, { wrapper: MockRouter });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should open a blank form', () => {
    render(<CreateNewsPage />, { wrapper: MockRouter });

    expect(getTitleInput()).toHaveValue('');
    expect(getTextInput()).toHaveValue('');
    expect(getImageInput().files?.length).toBe(0);
  });

  it('should accept user input', async () => {
    render(<CreateNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.type(getTitleInput(), mockNews.title);
    });
    expect(getTitleInput()).toHaveValue(mockNews.title);

    await act(() => {
      userEvent.type(getTextInput(), mockNews.text);
    });
    expect(getTextInput()).toHaveValue(mockNews.text);

    await act(() => {
      dropFile(getImageDropbox(), mockImageWithUrl);
    });
    expect(getImagePreview()).toBeInTheDocument();
    expect(getImage().src).toBe(mockImageWithUrl.url);
  });

  it('should validate form fields', async () => {
    render(<CreateNewsPage />, { wrapper: MockRouter });

    expect(getSubmitBtn()).toBeDisabled();

    await act(() => {
      fireEvent.blur(getTitleInput());
    });
    expect(
      screen.getByText('formFields.news.title.errorText'),
    ).toBeInTheDocument();

    await act(() => {
      fireEvent.blur(getTextInput());
    });
    expect(
      screen.getByText('formFields.news.text.errorText'),
    ).toBeInTheDocument();
  });

  it('should handle form submit', async () => {
    render(<CreateNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.type(getTitleInput(), mockNews.title);
      userEvent.type(getTextInput(), mockNews.text);
      dropFile(getImageDropbox(), mockImageWithUrl);
    });

    await act(() => {
      userEvent.click(getSubmitBtn());
    });

    expect(mockNewsStoreCreateArticle).toHaveBeenCalledWith(mockNews);
    expect(screen.getByText('News page')).toBeInTheDocument();
  });

  it('should be able to navigate back to news page', async () => {
    render(<CreateNewsPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.click(getBackBtn());
    });

    expect(screen.getByText('News page')).toBeInTheDocument();
  });
});
