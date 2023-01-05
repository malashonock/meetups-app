import classNames from 'classnames';
import { Typography, TypographyComponent } from 'components';
import { ReactComponent as ImagePlaceholder } from './assets/image-placeholder.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as ChangeImageIcon } from './assets/change-photo.svg';
import { FileWithUrl } from 'types';
import { getFileSizeString } from 'helpers';
import styles from './ImagePreview.module.scss';

export enum ImagePreviewMode {
  Thumbnail = 'thumbnail',
  Large = 'large',
}

interface ImagePreviewProps {
  variant?: ImagePreviewMode;
  image: FileWithUrl;
  onClear: () => void;
}

export const ImagePreview = ({
  variant = ImagePreviewMode.Thumbnail,
  image,
  onClear,
}: ImagePreviewProps): JSX.Element => {
  const { name, size, url } = image;

  const handleClear = (): void => {
    onClear();
  };

  return (
    <div className={classNames(styles.preview, styles[variant])}>
      <figure className={styles.image}>
        {url ? (
          <img src={url} alt="Загруженное изображение" />
        ) : (
          <ImagePlaceholder className={styles.placeholder} />
        )}
      </figure>
      {variant === ImagePreviewMode.Thumbnail && (
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
      )}
      <button className={styles.clearBtn} onClick={handleClear}>
        {variant === ImagePreviewMode.Thumbnail ? (
          <CloseIcon />
        ) : (
          <ChangeImageIcon />
        )}
      </button>
    </div>
  );
};
