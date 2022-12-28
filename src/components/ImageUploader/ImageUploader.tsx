import { ImageDropbox, ImagePreview } from 'components';
import { Dispatch, SetStateAction, useState } from 'react';

export interface ImageUploaderProps {
  image: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
}

export const ImageUploader = (): JSX.Element => {
  const [image, setImage] = useState<File | null>(null);

  const uploaderProps: ImageUploaderProps = {
    image,
    setImage,
  };

  return !image ? (
    <ImageDropbox {...uploaderProps} />
  ) : (
    <ImagePreview {...uploaderProps} />
  );
};
