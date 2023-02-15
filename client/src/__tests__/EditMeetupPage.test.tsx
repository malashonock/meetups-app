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
import { useMeetup, useUserStore } from 'hooks';
import { Meetup } from 'stores';

jest.mock('utils/file');

// Mock useMeetup & useUsers hook
jest.mock('hooks', () => {
  return {
    ...jest.requireActual('hooks'),
    useUserStore: jest.fn(),
    useMeetup: jest.fn(),
  };
});
const mockUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;
const mockUseMeetup = useMeetup as jest.MockedFunction<typeof useMeetup>;

const mockMeetupUpdate = jest.spyOn(Meetup.prototype, 'update');

beforeEach(() => {
  mockUseUserStore.mockReturnValue({
    users: [mockUser, mockUser2],
  });
  mockUseMeetup.mockReturnValue(mockMeetup);
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
  author: mockUser2,
  place: 'room 321',
  start: new Date(2023, 2, 20, 15, 0),
  finish: new Date(2023, 2, 20, 16, 30),
  image: mockImageWithUrl2,
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

    // Edit subject
    await act(() => {
      userEvent.clear(getSubjectInput());
      userEvent.type(getSubjectInput(), mockUpdatedMeetup.subject);
    });
    expect(getSubjectInput()).toHaveValue(mockUpdatedMeetup.subject);

    // Edit excerpt
    await act(() => {
      userEvent.clear(getExcerptInput());
      userEvent.type(getExcerptInput(), mockUpdatedMeetup.excerpt);
    });
    expect(getExcerptInput()).toHaveValue(mockUpdatedMeetup.excerpt);

    // Select another speaker
    await act(() => {
      userEvent.click(getSpeakerSelect());
    });

    await act(async () => {
      userEvent.click(await screen.findByText(mockUser2.fullName));
    });
    expect(screen.getByText(mockUser2.fullName)).toBeInTheDocument();

    await act(() => {
      userEvent.click(getClearImageBtn());
    });
    expect(getImageDropbox()).toBeInTheDocument();

    // Select another start date/time
    await waitFor(() => {
      userEvent.click(getStartDatePicker());
    });

    let startDatePopup: HTMLDivElement;
    await waitFor(() => {
      startDatePopup = document.querySelector(
        'label[for="start"] ~ * .react-datepicker-popper',
      ) as HTMLDivElement;
    });

    await act(() => {
      const newDay = startDatePopup.querySelector(
        '.react-datepicker__day--020',
      ) as HTMLDivElement;
      userEvent.click(newDay);
    });

    await act(() => {
      const newTime = startDatePopup.querySelector(
        '.react-datepicker__time-list-item:nth-of-type(31)',
      ) as HTMLLIElement;
      userEvent.click(newTime);
    });

    await waitFor(() => {
      expect(new Date(getStartDatePicker().value)).toEqual(
        mockUpdatedMeetup.start,
      );
    });

    // Select another finish date/time
    await waitFor(() => {
      userEvent.click(getFinishDatePicker());
    });

    let finishDatePopup: HTMLDivElement;
    await waitFor(() => {
      finishDatePopup = document.querySelector(
        'label[for="finish"] ~ * .react-datepicker-popper',
      ) as HTMLDivElement;
    });

    await act(() => {
      const newDay = finishDatePopup.querySelector(
        '.react-datepicker__day--020',
      ) as HTMLDivElement;
      userEvent.click(newDay);
    });

    await act(() => {
      const newTime = finishDatePopup.querySelector(
        '.react-datepicker__time-list-item:nth-of-type(34)',
      ) as HTMLLIElement;
      userEvent.click(newTime);
    });

    await waitFor(() => {
      expect(new Date(getFinishDatePicker().value)).toEqual(
        mockUpdatedMeetup.finish,
      );
    });

    // Edit location
    await act(() => {
      userEvent.clear(getLocationInput());
      userEvent.type(getLocationInput(), mockUpdatedMeetup.place || '');
    });
    expect(getLocationInput()).toHaveValue(mockUpdatedMeetup.place);

    // Upload another image
    await act(() => {
      dropFile(getImageDropbox(), mockImageWithUrl2);
    });
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

    await act(() => {
      userEvent.click(getClearImageBtn());
    });

    // Select another start date/time
    await waitFor(() => {
      userEvent.click(getStartDatePicker());
    });

    let startDatePopup: HTMLDivElement;
    await waitFor(() => {
      startDatePopup = document.querySelector(
        'label[for="start"] ~ * .react-datepicker-popper',
      ) as HTMLDivElement;
    });

    await act(() => {
      const newDay = startDatePopup.querySelector(
        '.react-datepicker__day--020',
      ) as HTMLDivElement;
      userEvent.click(newDay);
    });

    await act(() => {
      const newTime = startDatePopup.querySelector(
        '.react-datepicker__time-list-item:nth-of-type(31)',
      ) as HTMLLIElement;
      userEvent.click(newTime);
    });

    // Select another finish date/time
    await waitFor(() => {
      userEvent.click(getFinishDatePicker());
    });

    let finishDatePopup: HTMLDivElement;
    await waitFor(() => {
      finishDatePopup = document.querySelector(
        'label[for="finish"] ~ * .react-datepicker-popper',
      ) as HTMLDivElement;
    });

    await act(() => {
      const newDay = finishDatePopup.querySelector(
        '.react-datepicker__day--020',
      ) as HTMLDivElement;
      userEvent.click(newDay);
    });

    await act(() => {
      const newTime = finishDatePopup.querySelector(
        '.react-datepicker__time-list-item:nth-of-type(34)',
      ) as HTMLLIElement;
      userEvent.click(newTime);
    });

    // Edit location
    await act(() => {
      userEvent.clear(getLocationInput());
      userEvent.type(getLocationInput(), mockUpdatedMeetup.place || '');
    });

    // Upload another image
    await act(() => {
      dropFile(getImageDropbox(), mockImageWithUrl2);
    });

    // Submit and check result
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

  it('should render a Not Found page if useMeetup returns undefined', () => {
    mockUseMeetup.mockReturnValue(undefined);

    render(<EditMeetupPage />, { wrapper: MockRouter });

    expect(screen.getByText('notFoundPage.title')).toBeInTheDocument();
  });
});
