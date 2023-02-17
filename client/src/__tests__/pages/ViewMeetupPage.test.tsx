import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ViewMeetupPage } from 'pages';
import {
  mockTopic,
  mockMeetupDraft,
  mockMeetupDraftFilled,
  mockMeetup,
  mockUser,
} from 'model/__fakes__';
import { useAuthStore, useMeetup } from 'hooks';
import { Meetup } from 'stores';

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
);

describe('ViewMeetupPage', () => {
  describe('before topic approval', () => {
    beforeEach(() => {
      mockUseMeetup.mockReturnValue(mockTopic);
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

    describe('given a user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockUser,
        });
      });

      it('should match snapshot', () => {
        const { asFragment } = render(<ViewMeetupPage />, {
          wrapper: MockRouter,
        });
        expect(asFragment()).toMatchSnapshot();
      });

      describe('Delete button', () => {
        it('on click, should call meetup.delete() method', () => {
          jest.spyOn(window, 'confirm').mockImplementation(() => true);
          render(<ViewMeetupPage />, { wrapper: MockRouter });
          userEvent.click(screen.getByText('formButtons.delete'));
          expect(mockMeetupDelete).toHaveBeenCalled();
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
      mockUseMeetup.mockReturnValue(mockMeetupDraftFilled);
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

    describe('given a user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockUser,
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
            mockUseMeetup.mockReturnValue(mockMeetupDraft);
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
      mockUseMeetup.mockReturnValue(mockMeetup);
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

    describe('given a user is logged in', () => {
      beforeEach(() => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockUser,
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

  describe('regardless of meetup status', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockUser,
      });
      mockUseMeetup.mockReturnValue(mockMeetup);
    });

    describe('Back button', () => {
      it('should navigate to previous page', async () => {
        render(<ViewMeetupPage />, { wrapper: MockRouter });
        userEvent.click(screen.getByText('formButtons.back'));
        expect(screen.getByText('Meetups page')).toBeInTheDocument();
      });
    });
  });

  describe('given useMeetup returns undefined', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockUser,
      });
      mockUseMeetup.mockReturnValue(undefined);
    });

    it('should render a Not Found page', () => {
      render(<ViewMeetupPage />, { wrapper: MockRouter });
      expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
    });
  });
});
