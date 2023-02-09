/* eslint-disable testing-library/no-unnecessary-act */

import { PropsWithChildren } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { ImageDropbox } from 'components';
import { FileWithUrl } from 'types';
import { getFileWithUrl } from 'utils/file';

// Mock useTranslation hook;
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        t: (key: string) => key,
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  Trans: ({ children }: PropsWithChildren): JSX.Element => <>{children}</>,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock getFileWithUrl function
jest.mock('utils/file', () => ({
  ...jest.requireActual('utils/file'),
  getFileWithUrl: jest.fn().mockImplementation(
    (file: File, url?: string): FileWithUrl => ({
      ...file,
      url: 'test-url',
    }),
  ),
}));

type Bytes = number;

const mockFile = (
  extension: string,
  size: Bytes,
  type: string = 'image',
): File => {
  const file = new File(['test'], `test.${extension}`, {
    type: `${type}/${extension}`,
  });
  Object.defineProperty(file, 'size', {
    configurable: true,
    enumerable: true,
    value: size,
  });
  return file;
};

const eventDataFrom = (fileOrFiles: File | File[]) => {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

  return {
    dataTransfer: {
      files,
      items: files.map((file: File) => ({
        kind: 'file',
        size: file.size,
        type: file.type,
        getAsFile: (): File => file,
      })),
      types: ['Files'],
    },
  };
};

describe('ImageDropbox', () => {
  it('accepts images with extensions .jpg, .jpeg, .png and size up to 10 Mb', async () => {
    const goodImage = mockFile('jpg', 1_000_000);
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.drop(imageDropbox, eventDataFrom(goodImage));
    });

    await waitFor(() => {
      expect(mockedHandleDrop).toHaveBeenCalledTimes(1);
    });

    expect(mockedHandleDrop).toHaveBeenCalledWith(getFileWithUrl(goodImage));
  });

  it('rejects images with size larger than 10 Mb', async () => {
    const tooLargeImage = mockFile('png', 1_000_000_000);
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.drop(imageDropbox, eventDataFrom(tooLargeImage));
    });

    await waitFor(() => {
      expect(mockedHandleDrop).not.toHaveBeenCalled();
    });
  });

  it('rejects files of types other than images', async () => {
    const notImage = mockFile('pdf', 1_000_000);
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.drop(imageDropbox, eventDataFrom(notImage));
    });

    await waitFor(() => {
      expect(mockedHandleDrop).not.toHaveBeenCalled();
    });
  });

  it('rejects attempts to upload multiple images', async () => {
    const goodImage = mockFile('jpg', 1_000_000);
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.drop(imageDropbox, eventDataFrom([goodImage, goodImage]));
    });

    await waitFor(() => {
      expect(mockedHandleDrop).not.toHaveBeenCalled();
    });
  });

  it('gets green if a file is being dragged over of acceptable type and size', async () => {
    const goodImage = mockFile('jpg', 1_000_000);

    render(<ImageDropbox onDrop={jest.fn()} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.dragEnter(imageDropbox, eventDataFrom(goodImage));
    });

    await waitFor(() => {
      expect(imageDropbox.classList).toContain('willAccept');
    });
  });

  it('gets red if a file is being dragged over of unacceptable type or size', async () => {
    const badFile = mockFile('avi', 1_000_000_000);

    render(<ImageDropbox onDrop={jest.fn()} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      fireEvent.dragEnter(imageDropbox, eventDataFrom(badFile));
    });

    await waitFor(() => {
      expect(imageDropbox.classList).toContain('willReject');
    });
  });

  it('renders external error messages', async () => {
    const ERR_MSG = 'Test error';
    render(<ImageDropbox onDrop={jest.fn()} externalError={ERR_MSG} />);

    const errorMessage = screen.getByText(ERR_MSG);
    expect(errorMessage).toBeInTheDocument();
  });
});
