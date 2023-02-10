import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImagePreview, ImagePreviewMode } from 'components';
import { FileWithUrl } from 'types';

const mockImage = (url: string = 'test-url'): FileWithUrl => {
  const file = new File(['test'], `test.jpg`, {
    type: `image/jpg`,
  });
  Object.defineProperties(file, {
    size: { value: 1_000_000 },
    url: { value: url },
  });
  return file as FileWithUrl;
};

describe('ImagePreview', () => {
  it('renders the provided image', async () => {
    const testImage = mockImage();

    render(<ImagePreview image={testImage} onClear={jest.fn()} />);

    const image = screen.getByAltText('imagePreview.imgAlt');
    expect(image).toBeInTheDocument();
  });

  it('when clicked on close button, calls onClear callback', () => {
    const testImage = mockImage();
    const mockedHandleClose = jest.fn();

    render(<ImagePreview image={testImage} onClear={mockedHandleClose} />);

    const closeBtn = screen.getByRole('button');
    userEvent.click(closeBtn);

    expect(mockedHandleClose).toHaveBeenCalledTimes(1);
  });

  describe('in Thumbnail mode', () => {
    it('renders file name', async () => {
      const testImage = mockImage();

      render(
        <ImagePreview
          variant={ImagePreviewMode.Thumbnail}
          image={testImage}
          onClear={jest.fn()}
        />,
      );

      const fileName = screen.getByText(testImage.name);
      expect(fileName).toBeInTheDocument();
    });

    it('renders file size', async () => {
      const testImage = mockImage();

      render(
        <ImagePreview
          variant={ImagePreviewMode.Thumbnail}
          image={testImage}
          onClear={jest.fn()}
        />,
      );

      const fileSize = screen.getByText('imagePreview.fileSize');
      expect(fileSize).toBeInTheDocument();
    });
  });

  describe('in Large mode', () => {
    it('does not render file name', async () => {
      const testImage = mockImage();

      render(
        <ImagePreview
          variant={ImagePreviewMode.Large}
          image={testImage}
          onClear={jest.fn()}
        />,
      );

      const fileName = screen.queryByText(testImage.name);
      expect(fileName).toBeNull();
    });

    it('does not render file size', async () => {
      const testImage = mockImage();

      render(
        <ImagePreview
          variant={ImagePreviewMode.Large}
          image={testImage}
          onClear={jest.fn()}
        />,
      );

      const fileSize = screen.queryByText('imagePreview.fileSize');
      expect(fileSize).toBeNull();
    });
  });
});
