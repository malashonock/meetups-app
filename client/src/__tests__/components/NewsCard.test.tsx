import { render, screen } from '@testing-library/react';

import { NewsCard } from 'components';
import { mockImageWithUrl, mockNewsArticle } from 'model/__fakes__';
import { useLocale } from 'hooks';
import { Locale } from 'stores';

// Mock useLocale and useUser hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useLocale: jest.fn(),
  };
});
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

beforeEach(() => {
  mockUseLocale.mockReturnValue([Locale.EN, () => undefined]);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('NewsCard', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<NewsCard news={mockNewsArticle} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render date, title & text, image', () => {
    render(<NewsCard news={mockNewsArticle} />);

    const date = screen.getByText('1/10/23');
    expect(date).toBeInTheDocument();

    const title = screen.getByText('Test news title');
    expect(title).toBeInTheDocument();

    const text = screen.getByText('Test news text');
    expect(text).toBeInTheDocument();

    const image = screen.getByAltText('Test news title') as HTMLImageElement;
    expect(image.src).toBe(mockImageWithUrl.url);
  });
});
