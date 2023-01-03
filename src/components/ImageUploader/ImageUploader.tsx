import { ImageDropbox, ImagePreview, ImagePreviewMode } from 'components';
import { useCallback, useState } from 'react';
import { FileWithUrl } from 'types';

interface ImageUploaderProps {
  variant?: ImagePreviewMode;
}

export const ImageUploader = ({
  variant = ImagePreviewMode.Thumbnail,
}: ImageUploaderProps): JSX.Element => {
  const [image, setImage] = useState<FileWithUrl | null>(null);

  const handleUpload = useCallback((image: FileWithUrl): void => {
    setImage(image);
  }, []);

  const handleClear = useCallback((): void => {
    if (image) {
      URL.revokeObjectURL(image.url);
    }

    setImage(null);
  }, []);

  return !image ? (
    <ImageDropbox onDrop={handleUpload} />
  ) : (
    <ImagePreview variant={variant} image={image} onClear={handleClear} />
  );
};
