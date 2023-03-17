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

import { EditMeetupPage } from 'pages';
import { MeetupFields } from 'model';
import {
  mockImageWithUrl2,
  mockMeetup,
  mockUser,
  mockUser2,
} from 'model/__fakes__';
import { dropFile } from 'utils';
import { useLocale, useMeetup, useUserStore } from 'hooks';
import { Locale, Meetup, RootStore } from 'stores';

jest.setTimeout(15 * 1000);

jest.mock('utils/file');

// Mock hooks
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useUserStore: jest.fn(),
    useMeetup: jest.fn(),
    useLocale: jest.fn(),
  };
});
const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;
const mockUseMeetup = useMeetup as jest.MockedFunction<typeof useMeetup>;
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

const mockMeetupUpdate = jest.spyOn(Meetup.prototype, 'update');

beforeEach(() => {
  const { authStore, meetupStore } = new RootStore();
  const { userStore } = authStore;
  userStore.users = [mockUser, mockUser2];
  mockUseUserStore.mockReturnValue(userStore);

  const mockInitializedMeetup = new Meetup(mockMeetup, meetupStore);
  mockInitializedMeetup.image = mockMeetup.image;
  mockInitializedMeetup.isInitialized = true;
  mockUseMeetup.mockReturnValue(mockInitializedMeetup);

  mockUseLocale.mockReturnValue([Locale.RU, jest.fn()]);
});

afterEach(() => {
  jest.resetAllMocks();
});

const MockRouter = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={['/meetups', '/meetups/aaa/edit']}>
    <Routes>
      <Route path="/meetups">
        <Route index element={<h1>Meetups page</h1>} />
        <Route path=":id">
          <Route index element={<h1>View meetup</h1>} />
          <Route path="edit" element={children} />
        </Route>
      </Route>
    </Routes>
  </MemoryRouter>
);

const getSubjectInput = () =>
  screen.getByLabelText('formFields.meetup.topic.label');
const getExcerptInput = () =>
  screen.getByLabelText('formFields.meetup.description.label');
const getSpeakerSelect = () =>
  screen.getByTestId('select-field').querySelector('input') as HTMLInputElement;
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
  screen.getByAltText('imagePreview.imgAlt') as HTMLImageElement;
const getSubmitBtn = () => screen.getByText('formButtons.save');
const getCancelBtn = () => screen.getByText('formButtons.cancel');
const getPreviewBtn = () => screen.getByText('formButtons.preview');
const getClearImageBtn = () => screen.getByTestId('clear-button');

const mockUpdatedMeetup: MeetupFields = {
  subject: 'Updated meetup topic',
  excerpt: 'Updated meetup description',
  author: mockUser,
  speakers: [mockUser, mockUser2],
  place: 'room 321',
  start: new Date(2023, 2, 20, 15, 0),
  finish: new Date(2023, 2, 20, 16, 30),
  image: mockImageWithUrl2,
};

const editFields = async () => {
  // Edit subject
  await act(() => {
    userEvent.clear(getSubjectInput());
    userEvent.type(getSubjectInput(), mockUpdatedMeetup.subject);
  });

  // Edit excerpt
  await act(() => {
    userEvent.clear(getExcerptInput());
    userEvent.type(getExcerptInput(), mockUpdatedMeetup.excerpt);
  });

  // Select another speaker
  await act(() => {
    userEvent.click(getSpeakerSelect());
  });

  await act(async () => {
    userEvent.click(await screen.findByText(mockUser2.fullName));
  });

  // Select another start date/time
  await waitFor(() => {
    userEvent.clear(getStartDatePicker());
    userEvent.type(getStartDatePicker(), '20 Mar 2023 15:00');
  });

  // Select another finish date/time
  await waitFor(() => {
    userEvent.clear(getFinishDatePicker());
    userEvent.type(getFinishDatePicker(), '20 Mar 2023 16:30');
  });

  // Edit location
  await act(() => {
    userEvent.clear(getLocationInput());
    userEvent.type(getLocationInput(), mockUpdatedMeetup.place || '');
  });

  // Upload another image
  await act(() => {
    userEvent.click(getClearImageBtn());
  });

  await act(() => {
    dropFile(getImageDropbox(), mockImageWithUrl2);
  });
};

describe('EditMeetupPage', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(asFragment()).toMatchSnapshot();
  });

  it('on open, should pre-fill form inputs with the current field values', () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(getSubjectInput()).toHaveValue(mockMeetup.subject);
    expect(getExcerptInput()).toHaveValue(mockMeetup.excerpt);
    expect(screen.getByText(mockMeetup.author!.fullName)).toBeInTheDocument();
    expect(new Date(getStartDatePicker().value)).toEqual(mockMeetup.start);
    expect(new Date(getFinishDatePicker().value)).toEqual(mockMeetup.finish);
    expect(getLocationInput()).toHaveValue(mockMeetup.place);
    expect(getImage().src).toBe(mockMeetup.image?.url);
  });

  it('should accept user input', async () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    await editFields();

    expect(getSubjectInput()).toHaveValue(mockUpdatedMeetup.subject);
    expect(getExcerptInput()).toHaveValue(mockUpdatedMeetup.excerpt);
    expect(screen.getByText(mockUser2.fullName)).toBeInTheDocument();
    expect(new Date(getStartDatePicker().value)).toEqual(
      mockUpdatedMeetup.start,
    );
    expect(new Date(getFinishDatePicker().value)).toEqual(
      mockUpdatedMeetup.finish,
    );
    expect(getLocationInput()).toHaveValue(mockUpdatedMeetup.place);
    expect(getImagePreview()).toBeInTheDocument();
    expect(getImage().src).toBe(mockImageWithUrl2.url);
  });

  it('should validate form fields', async () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(getSubmitBtn()).toBeDisabled();

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

  it('should handle form submit', async () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    await editFields();

    await act(() => {
      userEvent.click(getSubmitBtn());
    });

    expect(mockMeetupUpdate).toHaveBeenCalledWith(mockUpdatedMeetup);
    expect(screen.getByText('editMeetupPage.title')).toBeInTheDocument();
  });

  it('should be able to navigate back to news page', async () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.click(getCancelBtn());
    });

    expect(screen.getByText('Meetups page')).toBeInTheDocument();
  });

  it('should be able to redirect to preview page', async () => {
    render(<EditMeetupPage />, { wrapper: MockRouter });

    await act(() => {
      userEvent.click(getPreviewBtn());
    });

    expect(screen.getByText('View meetup')).toBeInTheDocument();
  });

  it('should render a Loading spinner if meetup is undefined', () => {
    mockUseMeetup.mockReturnValue(undefined);
    render(<EditMeetupPage />, { wrapper: MockRouter });
    expect(screen.getByText('loadingText.meetup')).toBeInTheDocument();
  });

  it('should render a Loading spinner while meetup is loading', () => {
    const { meetupStore } = new RootStore();
    const mockLoadingMeetup = new Meetup(mockMeetup, meetupStore);
    mockLoadingMeetup.isLoading = true;
    mockUseMeetup.mockReturnValue(mockLoadingMeetup);

    render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(screen.getByText('loadingText.meetup')).toBeInTheDocument();
  });

  it('should render Not Found page if an error occurred while loading the meetup', () => {
    const { meetupStore } = new RootStore();
    const mockFailedMeetup = new Meetup(mockMeetup, meetupStore);
    mockFailedMeetup.isInitialized = true;
    mockFailedMeetup.isError = true;
    mockUseMeetup.mockReturnValue(mockFailedMeetup);

    render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
