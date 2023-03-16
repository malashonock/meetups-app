/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-wait-for-side-effects */

import { PropsWithChildren } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik, FormikErrors } from 'formik';

import { SelectField, SelectOption } from 'components';
import { IUser } from 'model';
import { Nullable } from 'types';

interface TestFormValues {
  user: Nullable<IUser>;
}

const users: IUser[] = [
  {
    id: 'aaa',
    name: 'John',
    surname: 'Doe',
  },
  {
    id: 'bbb',
    name: 'Alice',
    surname: 'Green',
  },
];

const userOptions: SelectOption<IUser>[] = users.map(
  (user: IUser): SelectOption<IUser> => ({
    value: user,
    label: `${user.name} ${user.surname}`,
  }),
);

let mockInitialValues: TestFormValues;
let mockValidate: (values: TestFormValues) => FormikErrors<TestFormValues>;
const handleSubmit: (user: Nullable<IUser>) => void = jest.fn();

const TestForm = ({ children }: PropsWithChildren): JSX.Element => (
  <Formik<TestFormValues>
    initialValues={mockInitialValues}
    validate={mockValidate}
    onSubmit={({ user }) => handleSubmit(user)}
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
    user: null,
  };
  mockValidate = () => ({});
});

describe('SelectField', () => {
  it('accepts user selection', async () => {
    render(
      <SelectField<IUser>
        name="user"
        selectProps={{
          options: userOptions,
        }}
      />,
      {
        wrapper: TestForm,
      },
    );

    const select = screen
      .getByTestId('select-user')
      .querySelector('input') as HTMLInputElement;
    userEvent.click(select);

    await waitFor(async () => {
      const userOption1 = await screen.findByText('John Doe');
      expect(userOption1).toBeInTheDocument();

      userEvent.click(userOption1);

      await waitFor(async () => {
        const submitBtn = screen.queryByTestId('submit') as HTMLButtonElement;
        userEvent.click(submitBtn);

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledWith(users[0]);
        });
      });
    });
  });

  it('pre-fills field with initial value', async () => {
    mockInitialValues = {
      user: users[0],
    };

    render(
      <SelectField<IUser>
        name="user"
        selectProps={{
          options: userOptions,
        }}
      />,
      {
        wrapper: TestForm,
      },
    );

    const userOption1 = screen.queryByText('John Doe');
    expect(userOption1).toBeInTheDocument();
  });

  it('renders label', async () => {
    const LABEL = 'Test select';

    render(
      <SelectField<IUser>
        name="user"
        labelText={LABEL}
        selectProps={{
          options: userOptions,
        }}
      />,
      {
        wrapper: TestForm,
      },
    );

    const label = screen.queryByText(LABEL);
    await waitFor(() => {
      expect(label).toBeInTheDocument();
    });
  });

  it('renders hint text', () => {
    const HINT = 'Select user';

    render(
      <SelectField<IUser>
        name="user"
        hintText={HINT}
        selectProps={{
          options: userOptions,
        }}
      />,
      {
        wrapper: TestForm,
      },
    );

    const hint = screen.queryByText(HINT);
    expect(hint).toBeInTheDocument();
  });

  it('shows error messages', async () => {
    const ERR_MSG_FIELD_NONEMPTY = 'Email is required';

    mockValidate = (values: TestFormValues): FormikErrors<TestFormValues> => {
      const errors: FormikErrors<TestFormValues> = {};
      if (!values.user) {
        errors.user = ERR_MSG_FIELD_NONEMPTY;
      }
      return errors;
    };

    render(
      <SelectField<IUser>
        name="user"
        selectProps={{
          options: userOptions,
        }}
      />,
      {
        wrapper: TestForm,
      },
    );

    const submitBtn = screen.queryByTestId('submit') as HTMLButtonElement;
    userEvent.click(submitBtn);

    await waitFor(async () => {
      const errorText = screen.getByText(ERR_MSG_FIELD_NONEMPTY);
      expect(errorText).toBeInTheDocument();
    });
  });
});
