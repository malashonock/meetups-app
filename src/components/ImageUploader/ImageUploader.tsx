import { ImageDropbox, ImagePreview } from 'components';
import { useState } from 'react';

export const ImageUploader = (): JSX.Element => {
  const [image, setImage] = useState<File | null>(null);

  return !image ? (
    <ImageDropbox setImage={setImage} />
  ) : (
    <ImagePreview image={image} />
  );
};
