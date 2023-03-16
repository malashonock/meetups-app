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
  mockFullUser,
} from 'model/__fakes__';
import { useAuthStore, useMeetup } from 'hooks';
import { Meetup, RootStore } from 'stores';
import { ConfirmDialogProvider } from 'components';

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
        const { authStore } = new RootStore();
        authStore.loggedUser = null;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = mockFullUser;
        mockUseAuthStore.mockReturnValue(authStore);
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
        const { authStore } = new RootStore();
        authStore.loggedUser = null;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = mockFullUser;
        mockUseAuthStore.mockReturnValue(authStore);
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
        const { authStore } = new RootStore();
        authStore.loggedUser = null;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('given a user is logged in', () => {
      beforeEach(() => {
        const { authStore } = new RootStore();
        authStore.loggedUser = mockFullUser;
        mockUseAuthStore.mockReturnValue(authStore);
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('regardless of meetup status', () => {
    beforeEach(() => {
      const { authStore } = new RootStore();
      authStore.loggedUser = mockFullUser;
      mockUseAuthStore.mockReturnValue(authStore);
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
