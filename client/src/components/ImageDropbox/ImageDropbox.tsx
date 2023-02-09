import { useState } from 'react';
import classNames from 'classnames';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { Trans, useTranslation } from 'react-i18next';

import { Typography, TypographyComponent } from 'components';
import { getFileSizeString, getFileWithUrl } from 'utils';
import { FileWithUrl } from 'types';

import styles from './ImageDropbox.module.scss';
import { ReactComponent as UploadIcon } from './upload.svg';

const ACCEPT_FORMATS = ['.jpg', '.jpeg', '.png'];

const MAX_FILESIZE = 10_000_000; // bytes

interface ImageDropboxProps {
  onDrop: (image: FileWithUrl) => void;
  externalError?: string;
}

export const ImageDropbox = ({
  onDrop,
  externalError,
}: ImageDropboxProps): JSX.Element => {
  const [internalErrors, setInternalErrors] = useState<string[]>([]);
  const { i18n, t } = useTranslation();

  const acceptOptions = ACCEPT_FORMATS.reduce((formats, format) => {
    return {
      ...formats,
      ...{
        ['image/' + format.slice(1)]: [],
      },
    };
  }, {});

  const acceptFileExtensions = ACCEPT_FORMATS.join(' ');

  const translateError = (error: string): string => {
    return error
      .replace('File type must be', t('imageDropbox.fileTypeHint'))
      .replace('File is larger than', t('imageDropbox.fileSizeHint'))
      .replace('bytes', t('imageDropbox.bytes'));
  };

  const handleAcceptedDrop = (acceptedFiles: File[]): void => {
    if (acceptedFiles.length > 0) {
      const image: FileWithUrl = getFileWithUrl(acceptedFiles[0]);
      onDrop(image);
    }
  };

  const handleRejectedDrop = (fileRejections: FileRejection[]): void => {
    // https://github.com/react-dropzone/react-dropzone/pull/938
    const errors = fileRejections
      .flatMap(({ errors }: FileRejection): FileError[] => errors)
      .map(({ message }: FileError): string => message)
      .map(translateError);

    setInternalErrors(errors);
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

  const errors: string[] =
    internalErrors.length > 0
      ? internalErrors
      : externalError
      ? [externalError]
      : [];

  const classList = classNames(
    styles.dropbox,
    isDragAccept ? styles.willAccept : '',
    isDragReject || errors.length > 0 ? styles.willReject : '',
  );

  return (
    <div className={styles.container}>
      <div
        {...getRootProps()}
        className={classList}
        data-testid="image-dropbox"
      >
        <input {...getInputProps()} data-testid="file-input" />
        <UploadIcon />
        <Typography
          component={TypographyComponent.Paragraph}
          className={styles.promptText}
        >
          <Trans i18nKey="imageDropbox.promptText">
            Перетащите изображения сюда
            <br />
            или
            <button
              type="button"
              className={styles.browseFileLink}
              onClick={open}
            >
              загрузите
            </button>
          </Trans>
        </Typography>
        <div className={styles.constraints}>
          <Typography component={TypographyComponent.Paragraph}>
            {t('imageDropbox.acceptedExtensions', {
              extensions: acceptFileExtensions,
            })}
          </Typography>
          <Typography component={TypographyComponent.Paragraph}>
            {t('imageDropbox.maxFileSize', {
              maxFileSize: getFileSizeString(MAX_FILESIZE, undefined, i18n),
            })}
          </Typography>
        </div>
        {errors.length > 0 ? (
          <ul className={styles.errors}>
            {errors.map((error: string, index: number) => (
              <li key={index}>
                <Typography
                  component={TypographyComponent.Paragraph}
                  className={styles.error}
                >
                  {error}
                </Typography>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
