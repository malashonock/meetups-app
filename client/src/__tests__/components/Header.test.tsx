import { PropsWithChildren } from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Header } from 'components';
import { RootStore } from 'stores';
import { mockFullUser as mockedLoggedUser } from 'model/__fakes__';
import { useAuthStore } from 'hooks';

// Mock useAuthStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

beforeEach(() => {
  const { authStore } = new RootStore();
  authStore.loggedUser = null;
  mockUseAuthStore.mockReturnValue(authStore);
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

// Mock LanguageSelect
jest.mock('components/LanguageSelect/LanguageSelect', () => {
  return {
    LanguageSelect: (): JSX.Element => {
      return <div data-testid="language-select" />;
    },
  };
});

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

    const meetupsPageLink = screen.getAllByText('meetups')[0];
    expect(meetupsPageLink).toBeInTheDocument();

    userEvent.click(meetupsPageLink);

    const meetupsPage = await screen.findByText('Meetups page');
    expect(meetupsPage).toBeInTheDocument();
  });

  it('renders the link to news page', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const newsPageLink = screen.getAllByText('news')[0];
    expect(newsPageLink).toBeInTheDocument();

    userEvent.click(newsPageLink);

    const newsPage = await screen.findByText('News page');
    expect(newsPage).toBeInTheDocument();
  });

  it('renders language select', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const languageSelect = screen.getAllByTestId('language-select')[0];
    expect(languageSelect).toBeInTheDocument();
  });

  it('renders authentication toggle', async () => {
    render(<Header />, { wrapper: MockLoginRouter });

    const authToggle = screen.getAllByTestId('auth-toggle')[0];
    expect(authToggle).toBeInTheDocument();
  });

  describe('if no user is authenticated', () => {
    beforeEach(() => {
      const { authStore } = new RootStore();
      authStore.loggedUser = null;
      mockUseAuthStore.mockReturnValue(authStore);
    });

    it('no user preview is rendered', async () => {
      render(<Header />, { wrapper: MockLoginRouter });

      const userPreview = screen.queryByTestId('user-preview');
      expect(userPreview).toBeNull();
    });
  });

  describe('if a user is authenticated', () => {
    beforeEach(() => {
      const { authStore } = new RootStore();
      authStore.loggedUser = mockedLoggedUser;
      mockUseAuthStore.mockReturnValue(authStore);
    });

    it('renders the user preview', async () => {
      render(<Header />, { wrapper: MockLoginRouter });

      const userName = screen.getAllByText(mockedLoggedUser.fullName)[0];
      expect(userName).toBeInTheDocument();
    });
  });
});
