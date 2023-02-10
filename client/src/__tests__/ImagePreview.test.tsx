import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImagePreview, ImagePreviewMode } from 'components';
import { mockImageWithUrl } from 'model/__fakes__';

describe('ImagePreview', () => {
  it('renders the provided image', async () => {
    const testImage = mockImageWithUrl;

    render(<ImagePreview image={testImage} onClear={jest.fn()} />);

    const image = screen.getByAltText('imagePreview.imgAlt');
    expect(image).toBeInTheDocument();
  });

  it('when clicked on close button, calls onClear callback', () => {
    const testImage = mockImageWithUrl;
    const mockedHandleClose = jest.fn();

    render(<ImagePreview image={testImage} onClear={mockedHandleClose} />);

    const closeBtn = screen.getByRole('button');
    userEvent.click(closeBtn);

    expect(mockedHandleClose).toHaveBeenCalledTimes(1);
  });

  describe('in Thumbnail mode', () => {
    it('renders file name', async () => {
      const testImage = mockImageWithUrl;

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
      const testImage = mockImageWithUrl;

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
      const testImage = mockImageWithUrl;

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
      const testImage = mockImageWithUrl;

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
