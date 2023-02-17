/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */

import { PropsWithChildren } from 'react';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DateTimePicker } from 'components';
import { Nullable } from 'types';

interface TestFormValues {
  date: Nullable<Date>;
}

type SubmitHandler<T> = (values: T, formikHelpers: FormikHelpers<T>) => void;

let mockInitialValues: TestFormValues;
let mockValidate: (values: TestFormValues) => FormikErrors<TestFormValues>;
const handleSubmit: SubmitHandler<TestFormValues> = jest.fn();

const TestForm = ({ children }: PropsWithChildren): JSX.Element => (
  <Formik<TestFormValues>
    initialValues={mockInitialValues}
    validate={mockValidate}
    onSubmit={handleSubmit}
  >
    <Form>
      {children}
      <button type="submit">Submit</button>
    </Form>
  </Formik>
);

beforeEach(() => {
  mockInitialValues = {
    date: null,
  };
  mockValidate = () => ({});
  jest.resetAllMocks();
});

describe('DateTimePicker', () => {
  it('opens and closes date/time picker', async () => {
    const { container } = render(<DateTimePicker name="date" />, {
      wrapper: TestForm,
    });

    await waitFor(async () => {
      const input = container.querySelector(
        'input[name="date"]',
      ) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      userEvent.click(input);

      await waitFor(async () => {
        const dtpPopup = container.querySelector('.react-datepicker-popper');
        expect(dtpPopup).toBeInTheDocument();

        userEvent.keyboard('{Escape}');

        expect(dtpPopup).not.toBeInTheDocument();
      });
    });
  });

  it('returns valid selected date and time value', async () => {
    const { container } = render(<DateTimePicker name="date" />, {
      wrapper: TestForm,
    });

    const input = container.querySelector(
      'input[name="date"]',
    ) as HTMLInputElement;
    userEvent.click(input);

    const dtpPopup = container.querySelector(
      '.react-datepicker-popper',
    ) as HTMLDivElement;

    await waitFor(async () => {
      const anyDay = dtpPopup.querySelector(
        '.react-datepicker__day--001',
      ) as HTMLDivElement;
      expect(anyDay).toBeInTheDocument();

      userEvent.click(anyDay);

      await waitFor(async () => {
        const anyTime = dtpPopup.querySelector(
          '.react-datepicker__time-list-item',
        ) as HTMLLIElement;
        expect(anyTime).toBeInTheDocument();

        userEvent.click(anyTime);

        expect(dtpPopup).not.toBeInTheDocument();

        const today = new Date();
        const expectedSelectedDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
          0,
          0,
          0,
        );
        const actualSelectedDate = new Date(input.value);
        expect(actualSelectedDate.getTime()).toBe(
          expectedSelectedDate.getTime(),
        );
      });
    });
  });

  it('renders label', () => {
    render(<DateTimePicker name="date" labelText="Test date" />, {
      wrapper: TestForm,
    });

    const label = screen.getByText('Test date');
    expect(label).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<DateTimePicker name="date" hintText="Enter date above" />, {
      wrapper: TestForm,
    });

    const hint = screen.getByText('Enter date above');
    expect(hint).toBeInTheDocument();
  });

  it('shows validation errors', async () => {
    const ERR_MSG = 'Date is required';

    mockValidate = (values: TestFormValues): FormikErrors<TestFormValues> => {
      const errors: FormikErrors<TestFormValues> = {};
      if (!values.date) {
        errors.date = ERR_MSG;
      }
      return errors;
    };

    const { container } = render(<DateTimePicker name="date" />, {
      wrapper: TestForm,
    });

    await waitFor(async () => {
      const input = container.querySelector(
        'input[name="date"]',
      ) as HTMLInputElement;
      userEvent.type(input, 'sometext');
      userEvent.clear(input);

      const submitBtn = screen.getByText('Submit');
      userEvent.click(submitBtn);

      const errorText = await screen.findByText(ERR_MSG);
      expect(errorText).toBeInTheDocument();
    });
  });

  it('pre-fills input with initial value', async () => {
    const today = new Date();

    mockInitialValues = {
      date: today,
    };

    const { container } = render(<DateTimePicker name="date" />, {
      wrapper: TestForm,
    });

    const input = container.querySelector(
      'input[name="date"]',
    ) as HTMLInputElement;
    const actualDate = new Date(input.value);
    const expectedDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours(),
      today.getMinutes(),
    );
    expect(actualDate.getTime()).toBe(expectedDate.getTime());
  });
});
