import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Header } from 'components';
import { RootStore } from 'stores';
import { mockEmployee as mockedLoggedUser } from 'mocks';

// Mock useAuthStore hook
import { useAuthStore } from 'hooks/useAuthStore';
jest.mock('hooks/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

// Mock useTranslation hook;
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

beforeEach(() => {
  mockUseAuthStore.mockReturnValue({
    loggedUser: null,
  });
});

const MockLoginRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/somepage']}>
    <Routes>
      <Route path="/" element={<h1>Home page</h1>} />
      <Route path="/login" element={<h1>Login page</h1>} />
      <Route path="/meetups" element={<h1>Meetups page</h1>} />
      <Route path="/news" element={<h1>News page</h1>} />
      <Route path="/somepage" element={children} />
    </Routes>
  </MemoryRouter>
);

describe('Header', () => {
  it('renders logo with link to homepage', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const logo = screen.getByAltText('logoAlt');
    expect(logo).toBeInTheDocument();

    userEvent.click(logo);

    const homePage = await screen.findByText('Home page');
    expect(homePage).toBeInTheDocument();
  });

  it('renders the link to meetups page', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const meetupsPageLink = screen.getByText('meetups');
    expect(meetupsPageLink).toBeInTheDocument();

    userEvent.click(meetupsPageLink);

    const meetupsPage = await screen.findByText('Meetups page');
    expect(meetupsPage).toBeInTheDocument();
  });

  it('renders the link to news page', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const newsPageLink = screen.getByText('news');
    expect(newsPageLink).toBeInTheDocument();

    userEvent.click(newsPageLink);

    const newsPage = await screen.findByText('News page');
    expect(newsPage).toBeInTheDocument();
  });

  it('renders language select', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const languageSelect = screen.getByTestId('language-select');
    expect(languageSelect).toBeInTheDocument();
  });

  it('renders authentication toggle', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const authToggle = screen.getByTestId('auth-toggle');
    expect(authToggle).toBeInTheDocument();
  });

  describe('if no user is authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: null,
      });
    });

    it('no user preview is rendered', async () => {
      render(<Header />, { wrapper: MockLoginRouter });

      const userPreview = screen.queryByTestId('user-preview');
      expect(userPreview).toBeNull();
    });
  });

  describe('if a user is authenticated', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockedLoggedUser,
        authStore: {
          rootStore: new RootStore(),
          loggedUser: mockedLoggedUser,
          logIn: jest.fn(),
          logOut: jest.fn(),
        },
      });
    });

    it('renders the user preview', async () => {
      render(<Header />, { wrapper: MockLoginRouter });

      const userName = screen.getByText(mockedLoggedUser.fullName);
      expect(userName).toBeInTheDocument();
    });
  });
});
