/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-wait-for-side-effects */

import { PropsWithChildren } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateMeetupPage } from 'pages';
import {
  mockFullUser,
  mockImageWithUrl,
  mockMeetup,
  mockMeetupFields,
  mockUser,
} from 'model/__fakes__';
import { dropFile } from 'utils';
import { useMeetupStore, useUserStore, useAuthStore } from 'hooks';
import { MeetupStore, RootStore } from 'stores';

jest.mock('utils/file');

// Mock useMeetupStore & useUsers hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useAuthStore: jest.fn(),
    useUserStore: jest.fn(),
    useMeetupStore: jest.fn(),
  };
});
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;
const mockUseMeetupStore = useMeetupStore as jest.MockedFunction<
  typeof useMeetupStore
>;

const mockCreateMeetup = jest.spyOn(MeetupStore.prototype, 'createMeetup');

beforeEach(() => {
  mockUseAuthStore.mockReturnValue({
    loggedUser: null,
  });
  mockUseUserStore.mockReturnValue({
    users: [mockUser],
  });
  mockUseMeetupStore.mockReturnValue({
    meetupStore: new MeetupStore(new RootStore()),
  });
  mockCreateMeetup.mockReturnValue(Promise.resolve(mockMeetup));
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/meetups', '/meetups/create']}>
    <Routes>
      <Route path="/meetups">
        <Route index element={<h1>Meetups page</h1>} />
        <Route path="create" element={children} />
        <Route path=":id" element={<h1>View just created meetup</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const getSubjectInput = () =>
  screen.getByLabelText('formFields.meetup.topic.label');
const getExcerptInput = () =>
  screen.getByLabelText('formFields.meetup.description.label');
const getSpeakerSelect = () =>
  screen
    .getByTestId('select-speakers')
    .querySelector('input') as HTMLInputElement;
const getStartDatePicker = () =>
  screen.getByLabelText(
    'formFields.meetup.datetimeStart.label',
  ) as HTMLInputElement;
const getFinishDatePicker = () =>
  screen.getByLabelText(
    'formFields.meetup.datetimeFinish.label',
  ) as HTMLInputElement;
const getLocationInput = () =>
  screen.getByLabelText('formFields.meetup.location.label');
const getImageDropbox = () => screen.getByTestId('image-dropbox');
const getImagePreview = () => screen.getByTestId('image-preview');
const getImage = () =>
  screen.queryByAltText('imagePreview.imgAlt') as HTMLImageElement;
const getBackBtn = () => screen.getByText('formButtons.back');
const getNextBtn = () => screen.getByText('formButtons.next');
const getCreateBtn = () => screen.getByText('formButtons.create');

const fillOutRequiredFields = async () => {
  // Fill out subject
  await act(() => {
    userEvent.type(getSubjectInput(), mockMeetupFields.subject);
  });

  // Fill out excerpt
  await act(() => {
    userEvent.type(getExcerptInput(), mockMeetupFields.excerpt);
  });

  // Select speaker
  await act(() => {
    userEvent.click(getSpeakerSelect());
  });

  await act(async () => {
    userEvent.click(await screen.findByText(mockUser.fullName));
  });
};

const fillOutOptionalFields = async () => {
  // Select start date/time
  await waitFor(() => {
    userEvent.type(getStartDatePicker(), '15 Mar 2099 14:00');
  });

  // Select finish date/time
  await waitFor(() => {
    userEvent.type(getFinishDatePicker(), '15 Mar 2099 15:30');
  });

  // Fill out location
  await act(() => {
    userEvent.type(getLocationInput(), mockMeetupFields.place!);
  });

  // Upload image
  await act(() => {
    dropFile(getImageDropbox(), mockMeetupFields.image!);
  });
};

const goToOptionalFields = async () => {
  const utils = render(<CreateMeetupPage />, { wrapper: MockRouter });
  await fillOutRequiredFields();
  await act(() => {
    userEvent.click(getNextBtn());
  });
  return utils;
};

describe('CreateMeetupPage', () => {
  describe('Step 1 - required fields', () => {
    it('should match snapshot', () => {
      const { asFragment } = render(<CreateMeetupPage />, {
        wrapper: MockRouter,
      });
      expect(asFragment()).toMatchSnapshot();
    });

    describe('when just opened', () => {
      it('should pre-fill form inputs (except speaker select) with blank values', () => {
        render(<CreateMeetupPage />, { wrapper: MockRouter });

        expect(getSubjectInput()).toHaveValue('');
        expect(getExcerptInput()).toHaveValue('');
      });

      it('should pre-populate speakers field with the meetup author, if they are authenticated', () => {
        mockUseAuthStore.mockReturnValue({
          loggedUser: mockFullUser,
        });

        render(<CreateMeetupPage />, { wrapper: MockRouter });

        expect(screen.getByText(mockUser.fullName)).toBeInTheDocument();
      });

      it('should leave speaker field blank if no user is authenticated', () => {
        render(<CreateMeetupPage />, { wrapper: MockRouter });

        expect(
          screen.getByText('formFields.meetup.speakers.placeholder'),
        ).toBeInTheDocument();
      });

      it('should disable the next button', () => {
        render(<CreateMeetupPage />, { wrapper: MockRouter });

        expect(getNextBtn()).toBeDisabled();
      });
    });

    it('should be able to navigate back to meetups page', async () => {
      render(<CreateMeetupPage />, { wrapper: MockRouter });

      await act(() => {
        userEvent.click(getBackBtn());
      });

      expect(screen.getByText('Meetups page')).toBeInTheDocument();
    });

    it('should accept user input', async () => {
      render(<CreateMeetupPage />, { wrapper: MockRouter });

      await fillOutRequiredFields();

      expect(getSubjectInput()).toHaveValue(mockMeetupFields.subject);
      expect(getExcerptInput()).toHaveValue(mockMeetupFields.excerpt);
      expect(screen.getByText(mockUser.fullName)).toBeInTheDocument();
    });

    it('should validate form fields', async () => {
      render(<CreateMeetupPage />, { wrapper: MockRouter });

      await act(() => {
        userEvent.clear(getSubjectInput());
        fireEvent.blur(getSubjectInput());
      });
      expect(
        screen.getByText('formFields.meetup.topic.errorText'),
      ).toBeInTheDocument();

      await act(() => {
        userEvent.clear(getExcerptInput());
        fireEvent.blur(getExcerptInput());
      });
      expect(
        screen.getByText('formFields.meetup.description.errorText'),
      ).toBeInTheDocument();
    });

    describe('when all required fields have been filled', () => {
      it('should enable the next button', async () => {
        render(<CreateMeetupPage />, { wrapper: MockRouter });

        await fillOutRequiredFields();

        expect(getNextBtn()).toBeEnabled();
      });

      it('should be able to navigate to Step 2', async () => {
        render(<CreateMeetupPage />, { wrapper: MockRouter });

        await fillOutRequiredFields();

        await act(() => {
          userEvent.click(getNextBtn());
        });

        expect(screen.getByTestId('step-1')).toHaveClass('passed');
        expect(screen.getByTestId('step-1')).not.toHaveClass('active');
        expect(screen.getByTestId('step-2')).toHaveClass('active');
      });
    });
  });

  describe('Step 2 - optional fields', () => {
    it('should match snapshot', async () => {
      const { asFragment } = await goToOptionalFields();

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when just opened', () => {
      it('should pre-fill form inputs with blank values', async () => {
        await goToOptionalFields();

        expect(getStartDatePicker()).toHaveValue('');
        expect(getFinishDatePicker()).toHaveValue('');
        expect(getLocationInput()).toHaveValue('');
        expect(getImageDropbox()).toBeInTheDocument();
        expect(getImage()).toBeNull();
      });

      it('should enable the create button', async () => {
        await goToOptionalFields();

        expect(getCreateBtn()).toBeEnabled();
      });
    });

    it('should be able to navigate back to Step 1', async () => {
      await goToOptionalFields();

      await act(() => {
        userEvent.click(getBackBtn());
      });

      expect(screen.getByTestId('step-1')).toHaveClass('active');
      expect(screen.getByTestId('step-2')).not.toHaveClass('active');
      expect(screen.getByTestId('step-2')).toHaveClass('passed');
    });

    it('should accept user input', async () => {
      await goToOptionalFields();

      await fillOutOptionalFields();

      expect(new Date(getStartDatePicker().value)).toEqual(
        mockMeetupFields.start,
      );
      expect(new Date(getFinishDatePicker().value)).toEqual(
        mockMeetupFields.finish,
      );
      expect(getLocationInput()).toHaveValue(mockMeetupFields.place);
      expect(getImagePreview()).toBeInTheDocument();
      expect(getImage().src).toBe(mockImageWithUrl.url);
    });

    describe('date fields validation', () => {
      it('should not allow to set finish date only', async () => {
        await goToOptionalFields();

        // Select finish date/time
        await act(() => {
          userEvent.type(getFinishDatePicker(), '15 Mar 2023 15:30');
        });

        // Touch start date/time
        await act(() => {
          getStartDatePicker().focus();
        });

        await act(() => {
          userEvent.keyboard('{Escape}');
        });

        expect(
          await screen.findByText('formFields.meetup.datetimeStart.errorText'),
        ).toBeInTheDocument();
        expect(getCreateBtn()).toBeDisabled();
        expect(getBackBtn()).toBeDisabled();
      });

      it('should not allow to set finish date earlier than start date', async () => {
        await goToOptionalFields();

        // Select start date/time
        await act(() => {
          userEvent.type(getStartDatePicker(), '15 Mar 2023 15:30');
        });

        // Select finish date/time
        await act(() => {
          userEvent.type(getFinishDatePicker(), '15 Mar 2023 14:00');
        });

        await act(() => {
          userEvent.keyboard('{Escape}');
        });

        expect(
          await screen.findByText('formFields.meetup.datetimeFinish.errorText'),
        ).toBeInTheDocument();
        expect(getCreateBtn()).toBeDisabled();
        expect(getBackBtn()).toBeDisabled();
      });
    });

    it('should handle form submit', async () => {
      mockUseAuthStore.mockReturnValue({
        loggedUser: mockFullUser,
      });

      await goToOptionalFields();

      await fillOutOptionalFields();

      await act(() => {
        userEvent.click(getCreateBtn());
      });

      expect(mockCreateMeetup).toHaveBeenCalledWith(mockMeetupFields);
      expect(screen.getByText('View just created meetup')).toBeInTheDocument();
    });
  });
});
