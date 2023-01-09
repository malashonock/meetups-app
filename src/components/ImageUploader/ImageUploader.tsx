import {
  ImageDropbox,
  ImagePreview,
  ImagePreviewMode,
  InputField,
  InputFieldExternalProps,
} from 'components';
import { FieldProps } from 'formik';
import { FileWithUrl } from 'types';

type ImageUploaderProps = InputFieldExternalProps & {
  name: string;
  variant?: ImagePreviewMode;
};

export const ImageUploader = ({
  variant = ImagePreviewMode.Thumbnail,
  ...inputFieldProps
}: ImageUploaderProps): JSX.Element => (
  <InputField {...inputFieldProps}>
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
  </InputField>
);
