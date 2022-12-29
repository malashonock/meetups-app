import { ImageDropbox, ImagePreview } from 'components';
import { useCallback, useState } from 'react';
import { FileWithUrl } from 'types';

export const ImageUploader = (): JSX.Element => {
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
    <ImagePreview image={image} onClear={handleClear} />
  );
};
