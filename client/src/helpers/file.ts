import { FileWithUrl } from 'types';

export const getFileWithUrl = (file: File): FileWithUrl => {
  const fileWithUrl: FileWithUrl = Object.assign(file, {
    url: URL.createObjectURL(file),
  });
  return fileWithUrl;
}