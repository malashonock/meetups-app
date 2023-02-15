/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from '@testing-library/react';

import { ImageDropbox } from 'components';
import {
  mockImage,
  mockLargeImage,
  mockLargeNonImage,
  mockNonImage,
} from 'model/__fakes__';
import { dragFile, dropFile } from 'utils/test';
import { getFileWithUrl } from 'utils/file';

jest.mock('utils/file');

describe('ImageDropbox', () => {
  it('accepts images with extensions .jpg, .jpeg, .png and size up to 10 Mb', async () => {
    const goodImage = mockImage;
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox name="image-dropbox" onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');
    await act(() => {
      dropFile(imageDropbox, goodImage);
    });

    expect(mockedHandleDrop).toHaveBeenCalledTimes(1);
    expect(mockedHandleDrop).toHaveBeenCalledWith(getFileWithUrl(goodImage));
  });

  it('rejects images with size larger than 10 Mb', async () => {
    const tooLargeImage = mockLargeImage;
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox name="image-dropbox" onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');

    await act(() => {
      dropFile(imageDropbox, tooLargeImage);
    });

    expect(mockedHandleDrop).not.toHaveBeenCalled();
  });

  it('rejects files of types other than images', async () => {
    const notImage = mockNonImage;
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox name="image-dropbox" onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');

    await act(() => {
      dropFile(imageDropbox, notImage);
    });

    expect(mockedHandleDrop).not.toHaveBeenCalled();
  });

  it('rejects attempts to upload multiple images', async () => {
    const goodImage = mockImage;
    const mockedHandleDrop = jest.fn();

    render(<ImageDropbox name="image-dropbox" onDrop={mockedHandleDrop} />);

    const imageDropbox = screen.getByTestId('image-dropbox');

    await act(() => {
      dropFile(imageDropbox, [goodImage, goodImage]);
    });

    expect(mockedHandleDrop).not.toHaveBeenCalled();
  });

  it('gets green if a file is being dragged over of acceptable type and size', async () => {
    const goodImage = mockImage;

    render(<ImageDropbox name="image-dropbox" onDrop={jest.fn()} />);

    const imageDropbox = screen.getByTestId('image-dropbox');

    await act(() => {
      dragFile(imageDropbox, goodImage);
    });

    expect(imageDropbox.classList).toContain('willAccept');
  });

  it('gets red if a file is being dragged over of unacceptable type or size', async () => {
    const badFile = mockLargeNonImage;

    render(<ImageDropbox name="image-dropbox" onDrop={jest.fn()} />);

    const imageDropbox = screen.getByTestId('image-dropbox');

    await act(() => {
      dragFile(imageDropbox, badFile);
    });

    expect(imageDropbox.classList).toContain('willReject');
  });

  it('renders external error messages', async () => {
    const ERR_MSG = 'Test error';
    render(
      <ImageDropbox
        name="image-dropbox"
        onDrop={jest.fn()}
        externalError={ERR_MSG}
      />,
    );

    const errorMessage = screen.getByText(ERR_MSG);
    expect(errorMessage).toBeInTheDocument();
  });
});
