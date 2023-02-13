import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MeetupStagesTabs, Typography } from 'components';
import { meetupTabsMapper } from 'components/MeetupStagesTabs/meetupTabsMapper';

// Mock meetupTabToDescriptor
jest.mock('components/MeetupStagesTabs/meetupTabsMapper', () => ({
  ...jest.requireActual('components/MeetupStagesTabs/meetupTabsMapper'),
  meetupTabsMapper: {
    topics: {
      label: () => 'Topics',
      component: 'Topics list',
    },
    moderation: {
      label: () => 'On moderation',
      component: 'Meetups on moderation',
    },
    upcoming: {
      label: () => 'Upcoming',
      component: 'Upcoming meetups',
    },
    finished: {
      label: () => 'Finished',
      component: 'Finished meetups',
    },
  },
}));

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/meetups']}>
    <Routes>
      <Route path="/meetups" element={<>{children}</>}>
        <Route path="topics" element={meetupTabsMapper.topics.component} />
        <Route
          path="moderation"
          element={meetupTabsMapper.moderation.component}
        />
        <Route path="upcoming" element={meetupTabsMapper.upcoming.component} />
        <Route path="finished" element={meetupTabsMapper.finished.component} />
      </Route>
    </Routes>
  </MemoryRouter>
);

describe('MeetupStagesTabs', () => {
  it('renders all provided tabs', () => {
    render(<MeetupStagesTabs />, { wrapper: MockRouter });

    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('On moderation')).toBeInTheDocument();
  });

  it('renders only the selected tab content', () => {
    render(<MeetupStagesTabs />, { wrapper: MockRouter });

    expect(screen.queryByText('Topics list')).not.toBeInTheDocument();
    expect(screen.queryByText('Meetups on moderation')).not.toBeInTheDocument();
    expect(screen.queryByText('Upcoming meetups')).not.toBeInTheDocument();
    expect(screen.queryByText('Finished meetups')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('Topics'));
    expect(screen.getByText('Topics list')).toBeInTheDocument();

    userEvent.click(screen.getByText('On moderation'));
    expect(screen.getByText('Meetups on moderation')).toBeInTheDocument();

    userEvent.click(screen.getByText('Upcoming'));
    expect(screen.getByText('Upcoming meetups')).toBeInTheDocument();

    userEvent.click(screen.getByText('Finished'));
    expect(screen.getByText('Finished meetups')).toBeInTheDocument();
  });
});
