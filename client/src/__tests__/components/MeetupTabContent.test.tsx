/* eslint-disable testing-library/no-node-access */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MeetupCardVariant, MeetupTabContent } from 'components';
import { useAuthStore, useMeetupStore } from 'hooks';
import { MeetupStatus } from 'model';
import { generateMeetups, mockFullUser } from 'model/__fakes__';
import { Meetup, RootStore } from 'stores';

const TOPICS_COUNT = 10;
const ONMODERATION_COUNT = 3;
const UPCOMING_COUNT = 5;
const FINISHED_COUNT = 7;

const mockTopics = generateMeetups(TOPICS_COUNT, MeetupStatus.REQUEST);
const mockMeetupDrafts = generateMeetups(
  ONMODERATION_COUNT,
  MeetupStatus.DRAFT,
);
const mockUpcomingMeetups = generateMeetups(
  UPCOMING_COUNT,
  MeetupStatus.CONFIRMED,
  'upcoming',
);
const mockFinishedMeetups = generateMeetups(
  FINISHED_COUNT,
  MeetupStatus.CONFIRMED,
  'finished',
);

const mockMeetups = [
  ...mockTopics,
  ...mockMeetupDrafts,
  ...mockUpcomingMeetups,
  ...mockFinishedMeetups,
];

// Mock useMeetupStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useMeetupStore: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseMeetupStore = useMeetupStore as jest.MockedFunction<
  typeof useMeetupStore
>;

// Mock MeetupCard
jest.mock('components/MeetupCard/MeetupCard', () => {
  return {
    ...jest.requireActual('components/MeetupCard/MeetupCard'),
    MeetupCard: (props: { meetup: Meetup }): JSX.Element => {
      return (
        <div data-testid="meetup-card">
          <div className="subject">{props.meetup.subject}</div>
        </div>
      );
    },
  };
});

beforeEach(() => {
  const { meetupStore, authStore } = new RootStore();

  meetupStore.meetups = mockMeetups;
  mockUseMeetupStore.mockReturnValue(meetupStore);

  authStore.loggedUser = null;
  mockUseAuthStore.mockReturnValue(authStore);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/meetups']}>
    <Routes>
      <Route path="/meetups">
        <Route index element={children} />
        <Route path="create" element={<h1>Create meetup page</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('MeetupTabContent', () => {
  it('renders the list of topics correctly', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Topic} />, {
      wrapper: MockRouter,
    });

    const meetupCards = screen.getAllByTestId('meetup-card');
    expect(meetupCards).toHaveLength(TOPICS_COUNT);

    const renderedSubjects = meetupCards.map(
      (element) => element.querySelector('.subject')?.textContent,
    );
    const expectedSubjects = mockTopics.map((meetup) => meetup.subject);
    expect(renderedSubjects).toEqual(expectedSubjects);
  });

  it('shows Create meetup button only if a user is logged in and only on topics tab', () => {
    const { rerender } = render(
      <MeetupTabContent variant={MeetupCardVariant.Topic} />,
      { wrapper: MockRouter },
    );
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();

    const { authStore } = new RootStore();
    authStore.loggedUser = mockFullUser;
    mockUseAuthStore.mockReturnValue(authStore);

    rerender(<MeetupTabContent variant={MeetupCardVariant.Topic} />);
    expect(
      screen.getByText('meetupTabContent.createMeetupBtn'),
    ).toBeInTheDocument();

    rerender(<MeetupTabContent variant={MeetupCardVariant.Draft} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();

    rerender(<MeetupTabContent variant={MeetupCardVariant.Upcoming} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();

    rerender(<MeetupTabContent variant={MeetupCardVariant.Finished} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();
  });

  it('renders the list of meetups on moderation correctly', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Draft} />, {
      wrapper: MockRouter,
    });

    const meetupCards = screen.getAllByTestId('meetup-card');
    expect(meetupCards).toHaveLength(ONMODERATION_COUNT);

    const renderedSubjects = meetupCards.map(
      (element) => element.querySelector('.subject')?.textContent,
    );
    const expectedSubjects = mockMeetupDrafts.map((meetup) => meetup.subject);
    expect(renderedSubjects).toEqual(expectedSubjects);
  });

  it('renders the list of upcoming meetups correctly', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Upcoming} />, {
      wrapper: MockRouter,
    });

    const meetupCards = screen.getAllByTestId('meetup-card');
    expect(meetupCards).toHaveLength(UPCOMING_COUNT);

    const renderedSubjects = meetupCards.map(
      (element) => element.querySelector('.subject')?.textContent,
    );
    const expectedSubjects = mockUpcomingMeetups.map(
      (meetup) => meetup.subject,
    );
    expect(renderedSubjects).toEqual(expectedSubjects);
  });

  it('renders the list of finished meetups correctly', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Finished} />, {
      wrapper: MockRouter,
    });

    const meetupCards = screen.getAllByTestId('meetup-card');
    expect(meetupCards).toHaveLength(FINISHED_COUNT);

    const renderedSubjects = meetupCards.map(
      (element) => element.querySelector('.subject')?.textContent,
    );
    const expectedSubjects = mockFinishedMeetups.map(
      (meetup) => meetup.subject,
    );
    expect(renderedSubjects).toEqual(expectedSubjects);
  });

  it('should render a Loading spinner while meetups are loading', () => {
    const { meetupStore } = new RootStore();
    meetupStore.meetups = mockMeetups;
    meetupStore.isLoading = true;
    mockUseMeetupStore.mockReturnValue(meetupStore);

    render(<MeetupTabContent variant={MeetupCardVariant.Upcoming} />, {
      wrapper: MockRouter,
    });

    expect(screen.getByText('loadingText.meetups')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading meetups', () => {
    const { meetupStore } = new RootStore();
    meetupStore.meetups = mockMeetups;
    meetupStore.isError = true;
    mockUseMeetupStore.mockReturnValue(meetupStore);

    render(<MeetupTabContent variant={MeetupCardVariant.Upcoming} />, {
      wrapper: MockRouter,
    });

    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});

describe('Create meetup button', () => {
  beforeEach(() => {
    const { authStore } = new RootStore();
    authStore.loggedUser = mockFullUser;
    mockUseAuthStore.mockReturnValue(authStore);
  });

  it('on click, navigates to /meetups/create route', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Topic} />, {
      wrapper: MockRouter,
    });

    userEvent.click(screen.getByText('meetupTabContent.createMeetupBtn'));
    expect(screen.getByText('Create meetup page')).toBeInTheDocument();
  });
});
