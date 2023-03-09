import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ViewMeetupPage } from 'pages';
import {
  mockTopic,
  mockMeetupDraft,
  mockMeetupDraftFilled,
  mockMeetup,
  mockTopicData,
  mockMeetupData,
  mockFullUser,
  mockFullUser2,
  mockUser,
  mockUser2,
} from 'model/__fakes__';
import { useAuthStore, useMeetup } from 'hooks';
import { Meetup, RootStore } from 'stores';
import { ConfirmDialogProvider } from 'components';
import { IMeetup } from 'model';

// Mock useAuthStore & useMeetup hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useMeetup: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseMeetup = useMeetup as jest.MockedFunction<typeof useMeetup>;

const mockMeetupApprove = jest.spyOn(Meetup.prototype, 'approve');
const mockMeetupPublish = jest.spyOn(Meetup.prototype, 'publish');
const mockMeetupDelete = jest.spyOn(Meetup.prototype, 'delete');
const mockMeetupVote = jest.spyOn(Meetup.prototype, 'vote');
const mockMeetupWithDrawVote = jest.spyOn(Meetup.prototype, 'withdrawVote');
const mockMeetupJoin = jest.spyOn(Meetup.prototype, 'join');
const mockMeetupCancelJoin = jest.spyOn(Meetup.prototype, 'cancelJoin');

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <ConfirmDialogProvider>
    <MemoryRouter initialEntries={['/meetups', '/meetups/aaa']}>
      <Routes>
        <Route path="/meetups">
          <Route index element={<h1>Meetups page</h1>} />
          <Route path=":id">
            <Route index element={children} />
            <Route path="edit" element={<h1>Edit meetup</h1>} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  </ConfirmDialogProvider>
);

describe('ViewMeetupPage', () => {
  describe('before topic approval', () => {
    beforeEach(() => {
      mockUseMeetup.mockReturnValue({
        meetup: mockTopic,
        isLoading: false,
        isError: false,
        errors: [],
      });
    });

    describe('given no user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: null,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user with non-admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser2,
        });
      });

      describe('Support Topic button', () => {
        describe('given the logged user has not yet voted', () => {
          beforeEach(() => {
            const rootStore = new RootStore();
            rootStore.authStore.loggedUser = mockFullUser2;
            const topic = new Meetup(mockTopicData, rootStore.meetupStore);
            mockUseMeetup.mockReturnValue({
              meetup: topic,
              isLoading: false,
              isError: false,
              errors: [],
            });
          });

          it('should match snapshot', () => {
            const { asFragment } = render(<ViewMeetupPage />, {
              wrapper: MockRouter,
            });
            expect(asFragment()).toMatchSnapshot();
          });

          it('on click, should call meetup.vote() method', async () => {
            render(<ViewMeetupPage />, { wrapper: MockRouter });

            userEvent.click(screen.getByText('viewMeetupPage.supportTopicBtn'));

            await waitFor(() => {
              expect(mockMeetupVote).toHaveBeenCalled();
            });
          });
        });

        describe('given the logged user already voted', () => {
          beforeEach(() => {
            const rootStore = new RootStore();
            rootStore.authStore.loggedUser = mockFullUser2;
            const topicData: IMeetup = {
              ...mockTopicData,
              votedUsers: [mockUser, mockUser2],
            };
            const topic = new Meetup(topicData, rootStore.meetupStore);
            mockUseMeetup.mockReturnValue({
              meetup: topic,
              isLoading: false,
              isError: false,
              errors: [],
            });
          });

          it('should match snapshot', () => {
            const { asFragment } = render(<ViewMeetupPage />, {
              wrapper: MockRouter,
            });
            expect(asFragment()).toMatchSnapshot();
          });

          it('on click, should call meetup.withdrawVote() method', async () => {
            render(<ViewMeetupPage />, { wrapper: MockRouter });

            userEvent.click(
              screen.getByText('viewMeetupPage.unsupportTopicBtn'),
            );

            await waitFor(() => {
              expect(mockMeetupWithDrawVote).toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('given a user with admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });

      describe('Delete button', () => {
        it('on click, should call meetup.delete() method', async () => {
          render(<ViewMeetupPage />, { wrapper: MockRouter });

          userEvent.click(screen.getByText('formButtons.delete'));
          userEvent.click(screen.getByTestId('confirm-button'));

          await waitFor(() => {
            expect(mockMeetupDelete).toHaveBeenCalled();
          });
        });
      });

      describe('Approve Topic button', () => {
        it('on click, should call meetup.approve() method', () => {
          render(<ViewMeetupPage />, { wrapper: MockRouter });
          userEvent.click(screen.getByText('viewMeetupPage.approveTopicBtn'));
          expect(mockMeetupApprove).toHaveBeenCalled();
        });
      });
    });
  });

  describe('after topic approval, but before publishing', () => {
    beforeEach(() => {
      mockUseMeetup.mockReturnValue({
        meetup: mockMeetupDraftFilled,
        isLoading: false,
        isError: false,
        errors: [],
      });
    });

    describe('given no user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: null,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user with non-admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser2,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user with admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });

      describe('Publish button', () => {
        describe('given time & location have been filled out', () => {
          it('on click, should call meetup.publish() method', () => {
            render(<ViewMeetupPage />, { wrapper: MockRouter });
            userEvent.click(screen.getByText('formButtons.publish'));
            expect(mockMeetupPublish).toHaveBeenCalled();
          });
        });

        describe('given time or location have not been filled out', () => {
          beforeEach(() => {
            mockUseMeetup.mockReturnValue({
              meetup: mockMeetupDraft,
              isLoading: false,
              isError: false,
              errors: [],
            });
          });

          it('should be disabled', () => {
            render(<ViewMeetupPage />, { wrapper: MockRouter });
            expect(screen.getByText('formButtons.publish')).toBeDisabled();
          });

          it('invalid time/location message should be displayed', () => {
            render(<ViewMeetupPage />, { wrapper: MockRouter });
            expect(
              screen.getByText('viewMeetupPage.timePlaceInfo.invalid'),
            ).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('after approval & publishing', () => {
    beforeEach(() => {
      mockUseMeetup.mockReturnValue({
        meetup: mockMeetup,
        isLoading: false,
        isError: false,
        errors: [],
      });
    });

    describe('given no user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: null,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user with non-admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser2,
        });
      });

      describe('given meetup start has not passed', () => {
        describe('Join Meetup toggler', () => {
          describe('given the logged user has not yet joined', () => {
            beforeEach(() => {
              const rootStore = new RootStore();
              rootStore.authStore.loggedUser = mockFullUser2;
              const start: Date = new Date(2999, 0, 1);
              const meetupData: IMeetup = {
                ...mockMeetupData,
                start,
                finish: new Date(start.getTime() + 2 * 60 * 60 * 1000),
              };
              const meetup = new Meetup(meetupData, rootStore.meetupStore);
              mockUseMeetup.mockReturnValue({
                meetup,
                isLoading: false,
                isError: false,
                errors: [],
              });
            });

            it('should match snapshot', () => {
              const { asFragment } = render(<ViewMeetupPage />, {
                wrapper: MockRouter,
              });
              expect(asFragment()).toMatchSnapshot();
            });

            it('on click, should call meetup.join() method', async () => {
              render(<ViewMeetupPage />, { wrapper: MockRouter });

              userEvent.click(screen.getByText('viewMeetupPage.joinMeetupBtn'));

              await waitFor(() => {
                expect(mockMeetupJoin).toHaveBeenCalled();
              });
            });
          });

          describe('given the logged user already joined', () => {
            beforeEach(() => {
              const rootStore = new RootStore();
              rootStore.authStore.loggedUser = mockFullUser2;
              const start = new Date(2999, 0, 1);
              const meetupData: IMeetup = {
                ...mockMeetupData,
                start,
                finish: new Date(start.getTime() + 2 * 60 * 60 * 1000),
                participants: [mockUser, mockUser2],
              };
              const meetup = new Meetup(meetupData, rootStore.meetupStore);
              mockUseMeetup.mockReturnValue({
                meetup,
                isLoading: false,
                isError: false,
                errors: [],
              });
            });

            it('should match snapshot', () => {
              const { asFragment } = render(<ViewMeetupPage />, {
                wrapper: MockRouter,
              });
              expect(asFragment()).toMatchSnapshot();
            });

            it('on click, should call meetup.cancelJoin() method', async () => {
              render(<ViewMeetupPage />, { wrapper: MockRouter });

              userEvent.click(
                screen.getByText('viewMeetupPage.unjoinMeetupBtn'),
              );

              await waitFor(() => {
                expect(mockMeetupCancelJoin).toHaveBeenCalled();
              });
            });
          });
        });
      });

      describe('given meetup start has passed', () => {
        it('should match snapshot', () => {
          const { asFragment } = render(<ViewMeetupPage />, {
            wrapper: MockRouter,
          });
          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('given a user with admin rights is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('regardless of meetup status and user role', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockFullUser,
      });
      mockUseMeetup.mockReturnValue({
        meetup: mockMeetup,
        isLoading: false,
        isError: false,
        errors: [],
      });
    });

    describe('Back button', () => {
      it('should navigate to previous page', async () => {
        render(<ViewMeetupPage />, { wrapper: MockRouter });
        userEvent.click(screen.getByText('formButtons.back'));
        expect(screen.getByText('Meetups page')).toBeInTheDocument();
      });
    });

    it('should render a Loading spinner if meetup is undefined', () => {
      mockUseMeetup.mockReturnValue({});
      render(<ViewMeetupPage />, { wrapper: MockRouter });
      expect(screen.getByText('loadingText.meetup')).toBeInTheDocument();
    });

    it('should render a Loading spinner while meetup is loading', () => {
      mockUseMeetup.mockReturnValue({
        meetup: mockMeetup,
        isLoading: true,
      });
      render(<ViewMeetupPage />, { wrapper: MockRouter });
      expect(screen.getByText('loadingText.meetup')).toBeInTheDocument();
    });

    it('should render Not Found page if an error occurred while loading the meetup', () => {
      mockUseMeetup.mockReturnValue({
        meetup: mockMeetup,
        isError: true,
      });
      render(<ViewMeetupPage />, { wrapper: MockRouter });
      expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
    });
  });
});
