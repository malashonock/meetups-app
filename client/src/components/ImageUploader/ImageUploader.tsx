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
  containerAttributes?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
};

export const ImageUploader = ({
  variant = ImagePreviewMode.Thumbnail,
  containerAttributes,
  ...inputFieldProps
}: ImageUploaderProps): JSX.Element => (
  <InputField containerAttributes={containerAttributes} {...inputFieldProps}>
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
        <ImageDropbox name={name} onDrop={handleUpload} externalError={error} />
      ) : (
        <ImagePreview variant={variant} image={image} onClear={handleClear} />
      );
    }}
  </InputField>
);
