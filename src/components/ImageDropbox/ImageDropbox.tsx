import { FileWithUrl } from 'types';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { Typography, TypographyComponent } from 'components';
import { ReactComponent as UploadIcon } from './upload.svg';
import { getFileSizeString } from 'helpers';
import styles from './ImageDropbox.module.scss';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes

interface ImageDropboxProps {
  onDrop: (image: FileWithUrl) => void;
}

export const ImageDropbox = ({ onDrop }: ImageDropboxProps): JSX.Element => {
  const acceptOptions = ACCEPT_FORMATS.reduce((formats, format) => {
    return {
      ...formats,
      ...{
        ['image/' + format.slice(1)]: [],
      },
    };
  }, {});

  const handleDrop = (acceptedFiles: File[]): void => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];

      const image: FileWithUrl = Object.assign(acceptedFile, {
        url: URL.createObjectURL(acceptedFile),
      });

      onDrop(image);
    }
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    useDropzone({
      accept: acceptOptions,
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxSize: MAX_FILESIZE,
      onDrop: handleDrop,
    });

  const classList = classNames(
    styles.dropbox,
    isDragAccept ? styles.willAccept : '',
    isDragReject ? styles.willReject : '',
  );

  const acceptFileExtensions = ACCEPT_FORMATS.join(' ');

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
            Максимальный размер файла: {getFileSizeString(MAX_FILESIZE)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
