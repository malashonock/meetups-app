import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from './upload.svg';
import styles from './ImageUploader.module.scss';
import {
  Typography,
  TypographyComponent,
} from 'components/Typography/Typography';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes
const BYTES_IN_MEGABYTE = 1_000_000;

export const ImageUploader = (): JSX.Element => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: {
      'image/*': ACCEPT_FORMATS,
    },
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: MAX_FILESIZE,
  });

  const classList = classNames(
    styles.dropBox,
    isFocused ?? styles.focused,
    isDragAccept ?? styles.accept,
    isDragReject ?? styles.reject,
  );

  const acceptFormats = ACCEPT_FORMATS.join(' ');

  const maxFileSize = Math.round(MAX_FILESIZE / BYTES_IN_MEGABYTE);

  return (
    <div className="container">
      <div {...getRootProps()} className={classList}>
        <input {...getInputProps()} />
        <UploadIcon />
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.promptText}
        >
          Перетащите изображения сюда
          <br />
          или{' '}
          <button className={styles.browseFileLink} onClick={open}>
            загрузите
          </button>
        </Typography>
        <div className={styles.constraints}>
          <Typography component={TypographyComponent.Paragraph}>
            Разрешенные форматы: {acceptFormats}
          </Typography>
          <Typography component={TypographyComponent.Paragraph}>
            Максимальный размер файла: {maxFileSize} Mb
          </Typography>
        </div>
      </div>
    </div>
  );
};
