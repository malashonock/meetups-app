/* eslint-disable testing-library/no-wait-for-side-effects */

import { PropsWithChildren } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';

import { TextField } from 'components';

interface TestFormValues {
  email: string;
}

type SubmitHandler<T> = (values: T, formikHelpers: FormikHelpers<T>) => void;

let mockInitialValues: TestFormValues;
let mockValidate: (values: TestFormValues) => FormikErrors<TestFormValues>;
const handleSubmit: SubmitHandler<TestFormValues> = jest.fn();

const VALID_EMAIL = 'johndoe@google.com';
const INVALID_EMAIL = 'not.an.email!';

const TestForm = ({ children }: PropsWithChildren): JSX.Element => (
  <Formik<TestFormValues>
    initialValues={mockInitialValues}
    validate={mockValidate}
    onSubmit={handleSubmit}
  >
    <Form>
      {children}
      <button type="submit" data-testid="submit">
        Submit
      </button>
    </Form>
  </Formik>
);

beforeEach(() => {
  mockInitialValues = {
    email: '',
  };
  mockValidate = () => ({});
});

describe('TextField', () => {
  it('by default, renders TextInput as input component', async () => {
    render(<TextField name="email" />, {
      wrapper: TestForm,
    });

    const textInput = screen.queryByTestId('text-input');
    expect(textInput).toBeInTheDocument();

    const textArea = screen.queryByTestId('text-area');
    expect(textArea).toBeNull();
  });

  it('renders TextInput if multiline is set to false', async () => {
    render(<TextField name="email" multiline={false} />, {
      wrapper: TestForm,
    });

    const textInput = screen.queryByTestId('text-input');
    expect(textInput).toBeInTheDocument();

    const textArea = screen.queryByTestId('text-area');
    expect(textArea).toBeNull();
  });

  it('renders TextArea if multiline is set to true', async () => {
    render(<TextField name="email" multiline />, {
      wrapper: TestForm,
    });

    const textInput = screen.queryByTestId('text-input');
    expect(textInput).toBeNull();

    const textArea = screen.queryByTestId('text-area');
    expect(textArea).toBeInTheDocument();
  });

  describe('if single-line input is rendered', () => {
    it('accepts user input', async () => {
      render(<TextField name="email" />, {
        wrapper: TestForm,
      });

      await waitFor(async () => {
        const input = screen.queryByTestId('text-input') as HTMLInputElement;
        userEvent.type(input, VALID_EMAIL);

        await waitFor(async () => {
          expect(input.value).toBe(VALID_EMAIL);
        });
      });
    });

    it('pre-fills field with initial value', async () => {
      mockInitialValues = {
        email: VALID_EMAIL,
      };

      render(<TextField name="email" />, {
        wrapper: TestForm,
      });

      const input = screen.queryByTestId('text-input') as HTMLInputElement;
      expect(input.value).toBe(VALID_EMAIL);
    });
  });

  describe('if multiline input is rendered', () => {
    it('accepts user input', async () => {
      render(<TextField name="email" multiline />, {
        wrapper: TestForm,
      });

      await waitFor(async () => {
        const input = screen.queryByTestId('text-area') as HTMLTextAreaElement;
        userEvent.type(input, VALID_EMAIL);

        await waitFor(async () => {
          expect(input.value).toBe(VALID_EMAIL);
        });
      });
    });

    it('pre-fills field with initial value', async () => {
      mockInitialValues = {
        email: VALID_EMAIL,
      };

      render(<TextField name="email" multiline />, {
        wrapper: TestForm,
      });

      const input = screen.queryByTestId('text-area') as HTMLTextAreaElement;
      expect(input.value).toBe(VALID_EMAIL);
    });
  });

  it('renders label', async () => {
    const LABEL = 'Test field';

    render(<TextField name="email" labelText={LABEL} />, {
      wrapper: TestForm,
    });

    const label = screen.queryByText(LABEL);
    await waitFor(() => {
      expect(label).toBeInTheDocument();
    });
  });

  it('renders hint text', () => {
    const HINT = 'Enter email';

    render(<TextField name="email" hintText={HINT} />, {
      wrapper: TestForm,
    });

    const hint = screen.queryByText(HINT);
    expect(hint).toBeInTheDocument();
  });

  it('shows error messages', async () => {
    const ERR_MSG_FIELD_NONEMPTY = 'Email is required';
    const ERR_MSG_EMAIL_INVALID = 'Enter a valid email';

    mockValidate = (values: TestFormValues): FormikErrors<TestFormValues> => {
      const errors: FormikErrors<TestFormValues> = {};
      if (!values.email) {
        errors.email = ERR_MSG_FIELD_NONEMPTY;
        return errors;
      }

      const EMAIL_REGEXP =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!EMAIL_REGEXP.test(values.email)) {
        errors.email = ERR_MSG_EMAIL_INVALID;
        return errors;
      }

      return errors;
    };

    render(<TextField name="email" />, {
      wrapper: TestForm,
    });

    const submitBtn = screen.queryByTestId('submit') as HTMLButtonElement;
    userEvent.click(submitBtn);

    await waitFor(async () => {
      const errorText = screen.getByText(ERR_MSG_FIELD_NONEMPTY);
      expect(errorText).toBeInTheDocument();

      const input = screen.queryByTestId('text-input') as HTMLInputElement;
      userEvent.type(input, INVALID_EMAIL);
      userEvent.click(submitBtn);

      await waitFor(async () => {
        const errorText = screen.getByText(ERR_MSG_EMAIL_INVALID);
        expect(errorText).toBeInTheDocument();
      });
    });
  });
});
