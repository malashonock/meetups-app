import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LanguageSelect } from 'components';
import { Locale } from 'stores';
import { useLocale } from 'hooks';

// Mock useLocale hook
jest.mock('hooks', () => ({
  ...jest.requireActual('hooks'),
  useLocale: jest.fn(),
}));
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

afterEach(() => {
  jest.resetAllMocks();
});

describe('LanguageSelect', () => {
  it('syncs selection with the current app locale', async () => {
    mockUseLocale.mockReturnValue([Locale.RU, jest.fn()]);

    render(<LanguageSelect />);

    const selectedLanguage = screen.getByText('RU');
    expect(selectedLanguage).toBeInTheDocument();
  });

  it('on language selection change, changes the app locale', async () => {
    const mockSetLocale = jest.fn();

    mockUseLocale.mockReturnValue([Locale.RU, mockSetLocale]);

    render(<LanguageSelect />);

    /* eslint-disable testing-library/no-node-access */
    const languageSelect = screen
      .getByTestId('language-select')
      .querySelector('input') as HTMLInputElement;
    userEvent.click(languageSelect);

    const englishOption = await screen.findByText('EN');
    expect(englishOption).toBeInTheDocument();

    userEvent.click(englishOption);
    expect(mockSetLocale).toHaveBeenCalledWith(Locale.EN);
  });
});
