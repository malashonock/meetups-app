import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from './upload.svg';
import { Typography, TypographyComponent } from 'components';
import styles from './ImageDropbox.module.scss';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes
const BYTES_IN_MEGABYTE = 1_000_000;

interface ImageDropboxProps {
  setImage: Dispatch<SetStateAction<File | null>>;
}

export const ImageDropbox = ({ setImage }: ImageDropboxProps): JSX.Element => {
  const acceptOptions = ACCEPT_FORMATS.reduce((formats, format) => {
    return {
      ...formats,
      ...{
        ['image/' + format.slice(1)]: [],
      },
    };
  }, {});

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    useDropzone({
      accept: acceptOptions,
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxSize: MAX_FILESIZE,
      onDrop,
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
