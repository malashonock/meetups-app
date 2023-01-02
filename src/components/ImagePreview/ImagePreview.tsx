import { FileWithPath } from 'react-dropzone';
import { Typography, TypographyComponent } from 'components';
import { ReactComponent as ThumbnailIcon } from './assets/thumbnail.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { FileWithUrl } from 'types';
import { getFileSizeString } from 'helpers';
import styles from './ImagePreview.module.scss';

interface ImagePreviewProps {
  image: FileWithUrl;
  onClear: () => void;
}

export const ImagePreview = ({
  image,
  onClear,
}: ImagePreviewProps): JSX.Element => {
  const { name, size, url } = image;

  const handleClear = (): void => {
    onClear();
  };

  return (
    <div className={styles.preview}>
      <figure className={styles.thumbnail}>
        {url ? (
          <img src={url} alt="Image thumbnail" />
        ) : (
          <ThumbnailIcon className={styles.placeholder} />
        )}
      </figure>
      <div className={styles.info}>
        <Typography
          component={TypographyComponent.Heading4}
          className={styles.fileName}
        >
          {name}
        </Typography>
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.fileSize}
        >
          File size: {getFileSizeString(size, 1)}
        </Typography>
      </div>
      <button className={styles.clearBtn} onClick={handleClear}>
        <CloseIcon className={styles.clearIcon} />
      </button>
    </div>
  );
};
