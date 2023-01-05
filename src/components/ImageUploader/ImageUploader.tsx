import { ImageDropbox, ImagePreview, ImagePreviewMode } from 'components';
import { Field, FieldProps } from 'formik';
import { FileWithUrl } from 'types';

interface ImageUploaderProps {
  name: string;
  variant?: ImagePreviewMode;
}

export const ImageUploader = ({
  name,
  variant = ImagePreviewMode.Thumbnail,
}: ImageUploaderProps): JSX.Element => (
  <Field name={name}>
    {({
      field: { name, value },
      form: { setFieldValue },
      meta: { error },
    }: FieldProps<FileWithUrl | null>) => {
      const image = value;
      const setImage = (image: FileWithUrl | null): void => {
        setFieldValue(name, image);
      };

      const handleUpload = (image: FileWithUrl): void => {
        setImage(image);
      };

      const handleClear = (): void => {
        if (image) {
          URL.revokeObjectURL(image.url);
        }

        setImage(null);
      };

      return !image ? (
        <ImageDropbox onDrop={handleUpload} externalError={error} />
      ) : (
        <ImagePreview variant={variant} image={image} onClear={handleClear} />
      );
    }}
  </Field>
);
