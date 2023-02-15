import { FileWithUrl } from 'types';

export const getFileWithUrl = (file: File, url?: string): FileWithUrl => {
  Object.defineProperty(file, 'url', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: url ?? `http://localhost/${file.name}`,
  });
  return file as FileWithUrl;
};
