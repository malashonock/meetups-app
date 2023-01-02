import { useState } from 'react';
import classNames from 'classnames';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { Typography, TypographyComponent } from 'components';
import { ReactComponent as UploadIcon } from './upload.svg';
import { getFileSizeString } from 'helpers';
import { FileWithUrl } from 'types';
import styles from './ImageDropbox.module.scss';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes

const ERRORS_TIMEOUT = 3_000; // milliseconds

interface ImageDropboxProps {
  onDrop: (image: FileWithUrl) => void;
}

export const ImageDropbox = ({ onDrop }: ImageDropboxProps): JSX.Element => {
  const [errors, setErrors] = useState<FileError[]>([]);

  const acceptOptions = ACCEPT_FORMATS.reduce((formats, format) => {
    return {
      ...formats,
      ...{
        ['image/' + format.slice(1)]: [],
      },
    };
  }, {});

  const handleAcceptedDrop = (acceptedFiles: File[]): void => {
    if (acceptedFiles.length > 0) {
      const acceptedFile = acceptedFiles[0];

      const image: FileWithUrl = Object.assign(acceptedFile, {
        url: URL.createObjectURL(acceptedFile),
      });

      onDrop(image);
    }
  };

  const handleRejectedDrop = (fileRejections: FileRejection[]): void => {
    // https://github.com/react-dropzone/react-dropzone/pull/938
    const errors = fileRejections.flatMap(
      ({ errors }: FileRejection): FileError[] => errors,
    );
    setErrors(errors);
    setTimeout(() => setErrors([]), ERRORS_TIMEOUT);
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } =
    useDropzone({
      accept: acceptOptions,
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxSize: MAX_FILESIZE,
      onDropAccepted: handleAcceptedDrop,
      onDropRejected: handleRejectedDrop,
    });

  const classList = classNames(
    styles.dropbox,
    isDragAccept ? styles.willAccept : '',
    isDragReject || errors.length > 0 ? styles.willReject : '',
  );

  const acceptFileExtensions = ACCEPT_FORMATS.join(' ');

  const translateError = (error: string): string => {
    return error
      .replace('File type must be', 'Допустимые типы файлов:')
      .replace('File is larger than', 'Размер файла превышает')
      .replace('bytes', 'байт');
  };

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
        {errors.length > 0 ? (
          <ul className={styles.errors}>
            {errors.map(({ code, message }: FileError): JSX.Element => {
              return (
                <li key={code}>
                  <Typography
                    component={TypographyComponent.Paragraph}
                    className={styles.error}
                  >
                    {translateError(message)}
                  </Typography>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
