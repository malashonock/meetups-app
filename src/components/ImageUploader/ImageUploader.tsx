import { ImageDropbox, ImagePreview } from 'components';
import { Dispatch, SetStateAction, useState } from 'react';

export interface ImageState {
  image: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
}

export const ImageUploader = (): JSX.Element => {
  const [image, setImage] = useState<File | null>(null);

  const imageState: ImageState = {
    image,
    setImage,
  };

  return !image ? (
    <ImageDropbox {...imageState} />
  ) : (
    <ImagePreview {...imageState} />
  );
};
