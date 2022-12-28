import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from './upload.svg';
import {
  Typography,
  TypographyComponent,
} from 'components/Typography/Typography';
import { ImageUploaderProps } from 'components/ImageUploader/ImageUploader';
import styles from './ImageDropbox.module.scss';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes
const BYTES_IN_MEGABYTE = 1_000_000;

export const ImageDropbox = ({
  image,
  setImage,
}: ImageUploaderProps): JSX.Element => {
  const acceptOptions = ACCEPT_FORMATS.reduce((formats, format) => {
    return {
      ...formats,
      ...{
        ['image/' + format.slice(1)]: [],
      },
    };
  }, {});

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    useDropzone({
      accept: acceptOptions,
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxSize: MAX_FILESIZE,
    });

  const classList = classNames(
    styles.dropbox,
    isDragAccept ? styles.willAccept : '',
    isDragReject ? styles.willReject : '',
  );

  const acceptFileExtensions = ACCEPT_FORMATS.join(' ');

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
            Разрешенные форматы: {acceptFileExtensions}
          </Typography>
          <Typography component={TypographyComponent.Paragraph}>
            Максимальный размер файла: {maxFileSize} Mb
          </Typography>
        </div>
      </div>
    </div>
  );
};
