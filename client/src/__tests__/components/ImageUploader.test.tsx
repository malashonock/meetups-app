/* eslint-disable testing-library/no-unnecessary-act */

import { PropsWithChildren } from 'react';
import { act, render, screen } from '@testing-library/react';
import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';

import { ImageUploader } from 'components';
import { Nullable } from 'types';
import {
  mockImageWithUrl,
  mockLargeImageWithUrl,
  mockNonImageWithUrl,
} from 'model/__fakes__';
import { dropFile } from 'utils';

jest.mock('utils/file');

interface TestFormValues {
  image: Nullable<File>;
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
    image: null,
  };
  mockValidate = () => ({});
});

describe('ImageUploader', () => {
  it('returns valid uploaded image value', async () => {
    const testImage = mockImageWithUrl;

    render(<ImageUploader name="image" />, {
      wrapper: TestForm,
    });

    await act(() => {
      const imageDropbox = screen.getByTestId('image-dropbox');
      dropFile(imageDropbox, testImage);
    });

    const image = screen.getByAltText(
      'imagePreview.imgAlt',
    ) as HTMLInputElement;
    expect(image.src).toBe(testImage.url);
  });

  it('pre-fills field with initial value', async () => {
    const testImage = mockImageWithUrl;

    mockInitialValues = {
      image: testImage,
    };

    render(<ImageUploader name="image" />, {
      wrapper: TestForm,
    });

    const image = screen.getByAltText(
      'imagePreview.imgAlt',
    ) as HTMLImageElement;
    expect(image.src).toBe(testImage.url);
  });

  it('renders label', async () => {
    const LABEL = 'Test image uploader';

    render(<ImageUploader name="image" labelText={LABEL} />, {
      wrapper: TestForm,
    });

    const label = screen.getByText(LABEL);
    expect(label).toBeInTheDocument();
  });

  it('renders hint text', () => {
    const HINT = 'Upload image';

    render(<ImageUploader name="image" hintText={HINT} />, {
      wrapper: TestForm,
    });

    const hint = screen.getByText(HINT);
    expect(hint).toBeInTheDocument();
  });

  it('shows error message if uploaded file is not image', async () => {
    const badFile = mockNonImageWithUrl;
    const ERR_MSG = 'imageDropbox.fileTypeHint';

    mockValidate = (values: TestFormValues): FormikErrors<TestFormValues> => {
      const errors: FormikErrors<TestFormValues> = {};
      if (!values.image) {
        errors.image = ERR_MSG;
      }
      return errors;
    };

    render(<ImageUploader name="image" />, {
      wrapper: TestForm,
    });

    await act(() => {
      const imageDropbox = screen.getByTestId('image-dropbox');
      dropFile(imageDropbox, badFile);
    });

    const errorText = screen.getByText(new RegExp(ERR_MSG));
    expect(errorText).toBeInTheDocument();
  });

  it('shows error message if uploaded image is larger than 10 Mb', async () => {
    const tooLargeImage = mockLargeImageWithUrl;
    const ERR_MSG = 'imageDropbox.fileSizeHint';

    mockValidate = (values: TestFormValues): FormikErrors<TestFormValues> => {
      const errors: FormikErrors<TestFormValues> = {};
      if (!values.image) {
        errors.image = ERR_MSG;
      }
      return errors;
    };

    render(<ImageUploader name="image" />, {
      wrapper: TestForm,
    });

    await act(() => {
      const imageDropbox = screen.getByTestId('image-dropbox');
      dropFile(imageDropbox, tooLargeImage);
    });

    const errorText = screen.getByText(new RegExp(ERR_MSG));
    expect(errorText).toBeInTheDocument();
  });
});
