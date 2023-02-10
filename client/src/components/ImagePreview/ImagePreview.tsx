import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Typography, TypographyComponent } from 'components';
import { FileWithUrl } from 'types';
import { getFileSizeString } from 'utils';

import styles from './ImagePreview.module.scss';
import { ReactComponent as ImagePlaceholder } from './assets/image-placeholder.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as ChangeImageIcon } from './assets/change-photo.svg';

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
  const { i18n, t } = useTranslation();

  const handleClear = (): void => {
    onClear();
  };

  return (
    <div
      className={classNames(styles.preview, styles[variant])}
      data-testid="image-preview"
    >
      <figure className={styles.image}>
        {url ? (
          <img src={url} alt={t('imagePreview.imgAlt') || 'Uploaded image'} />
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
            {t('imagePreview.fileSize', {
              fileSize: getFileSizeString(size, 1, i18n),
            })}
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
