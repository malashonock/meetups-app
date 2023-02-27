import { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import { MeetupCard } from 'components';
import { mockFullUser, mockMeetup, mockTopic, mockUser } from 'model/__fakes__';
import { useAuthStore, useUser } from 'hooks';
import { Meetup } from 'stores';

// Mock useAuthStore and useUser hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useUser: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

const MockLoginRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/meetups']}>
    <Routes>
      <Route path="/meetups">
        <Route index element={children} />
        <Route path=":id/edit" element={<h1>Edit meetup</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

beforeEach(() => {
  mockUseAuthStore.mockReturnValue({
    loggedUser: mockFullUser,
  });
  mockUseUser.mockReturnValue(mockUser);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('MeetupCard', () => {
  describe('before topic approval', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<MeetupCard meetup={mockTopic} />, {
        wrapper: MockLoginRouter,
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render author, topic & decription, votes count', () => {
      render(<MeetupCard meetup={mockTopic} />, { wrapper: MockLoginRouter });

      const author = screen.getByText('John Doe');
      expect(author).toBeInTheDocument();

      const topic = screen.getByText('Test meetup topic');
      expect(topic).toBeInTheDocument();

      const description = screen.getByText('Test meetup description');
      expect(description).toBeInTheDocument();

      const votesCount = screen.getByText('votesCount.text');
      expect(votesCount).toBeInTheDocument();
    });
  });

  describe('after topic approval', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<MeetupCard meetup={mockMeetup} />, {
        wrapper: MockLoginRouter,
      });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should render date/time & location, topic & decription, and author', () => {
      render(<MeetupCard meetup={mockMeetup} />, { wrapper: MockLoginRouter });

      const date = screen.getByText('15 марта', { exact: false });
      expect(date).toBeInTheDocument();

      const time = screen.getByText('14:00');
      expect(time).toBeInTheDocument();

      const location = screen.getByText('room 123');
      expect(location).toBeInTheDocument();

      const topic = screen.getByText('Test meetup topic');
      expect(topic).toBeInTheDocument();

      const description = screen.getByText('Test meetup description');
      expect(description).toBeInTheDocument();

      const author = screen.getByText('John Doe');
      expect(author).toBeInTheDocument();
    });
  });

  describe('edit & delete buttons', () => {
    it('should not be rendered unless user is logged in', () => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: null,
      });

      render(<MeetupCard meetup={mockMeetup} />, { wrapper: MockLoginRouter });

      const deleteButton = screen.queryByTestId('delete-button');
      expect(deleteButton).toBeNull();

      const editButton = screen.queryByTestId('edit-button');
      expect(editButton).toBeNull();
    });

    it('before topic approval, only delete button should be rendered', () => {
      render(<MeetupCard meetup={mockTopic} />, { wrapper: MockLoginRouter });

      const deleteButton = screen.getByTestId('delete-button');
      expect(deleteButton).toBeInTheDocument();

      const editButton = screen.queryByTestId('edit-button');
      expect(editButton).toBeNull();
    });

    it('after topic approval, both delete and edit buttons should be rendered', () => {
      render(<MeetupCard meetup={mockMeetup} />, { wrapper: MockLoginRouter });

      const deleteButton = screen.getByTestId('delete-button');
      expect(deleteButton).toBeInTheDocument();

      const editButton = screen.getByTestId('edit-button');
      expect(editButton).toBeInTheDocument();
    });
  });

  it('on delete button click, should call meetup.delete() method', () => {
    const spiedOnDelete = jest.spyOn(Meetup.prototype, 'delete');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<MeetupCard meetup={mockMeetup} />, { wrapper: MockLoginRouter });

    const deleteButton = screen.getByTestId('delete-button');
    userEvent.click(deleteButton);

    expect(spiedOnDelete).toHaveBeenCalledTimes(1);
  });

  it('on edit button click, should navigate to Edit meetup page', async () => {
    render(<MeetupCard meetup={mockMeetup} />, { wrapper: MockLoginRouter });

    const editButton = screen.getByTestId('edit-button');
    userEvent.click(editButton);

    const editMeetupPage = await screen.findByText('Edit meetup');
    expect(editMeetupPage).toBeInTheDocument();
  });
});
