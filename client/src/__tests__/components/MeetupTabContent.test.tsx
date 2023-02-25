/* eslint-disable testing-library/no-node-access */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { MeetupCardVariant, MeetupTabContent } from 'components';
import { useMeetupStore } from 'hooks';
import { MeetupStatus } from 'model';
import { generateMeetups } from 'model/__fakes__';
import userEvent from '@testing-library/user-event';

const TOPICS_COUNT = 10;
const ONMODERATION_COUNT = 3;
const UPCOMING_COUNT = 5;
const FINISHED_COUNT = 7;

const mockTopics = generateMeetups(TOPICS_COUNT, MeetupStatus.REQUEST);
const mockMeetupsOnModeration = generateMeetups(
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
  ...mockMeetupsOnModeration,
  ...mockUpcomingMeetups,
  ...mockFinishedMeetups,
];

// Mock useMeetupStore hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useMeetupStore: jest.fn(),
  };
});
const mockUseMeetupStore = useMeetupStore as jest.MockedFunction<
  typeof useMeetupStore
>;

beforeEach(() => {
  mockUseMeetupStore.mockReturnValue({
    meetups: mockMeetups,
  });
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

  it('shows Create meetup button only on topics tab', () => {
    const { rerender } = render(
      <MeetupTabContent variant={MeetupCardVariant.Topic} />,
      { wrapper: MockRouter },
    );
    expect(
      screen.getByText('meetupTabContent.createMeetupBtn'),
    ).toBeInTheDocument();

    rerender(<MeetupTabContent variant={MeetupCardVariant.OnModeration} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();

    rerender(<MeetupTabContent variant={MeetupCardVariant.Upcoming} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();

    rerender(<MeetupTabContent variant={MeetupCardVariant.Finished} />);
    expect(screen.queryByText('meetupTabContent.createMeetupBtn')).toBeNull();
  });

  it('renders the list of meetups on moderation correctly', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.OnModeration} />, {
      wrapper: MockRouter,
    });

    const meetupCards = screen.getAllByTestId('meetup-card');
    expect(meetupCards).toHaveLength(ONMODERATION_COUNT);

    const renderedSubjects = meetupCards.map(
      (element) => element.querySelector('.subject')?.textContent,
    );
    const expectedSubjects = mockMeetupsOnModeration.map(
      (meetup) => meetup.subject,
    );
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
});

describe('Create meetup button', () => {
  it('on click, navigates to /meetups/create route', () => {
    render(<MeetupTabContent variant={MeetupCardVariant.Topic} />, {
      wrapper: MockRouter,
    });

    userEvent.click(screen.getByText('meetupTabContent.createMeetupBtn'));
    expect(screen.getByText('Create meetup page')).toBeInTheDocument();
  });
});