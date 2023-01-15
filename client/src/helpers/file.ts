import { FileWithUrl } from 'types';

export const getFileWithUrl = (file: File, url?: string): FileWithUrl => {
  const fileWithUrl: FileWithUrl = Object.assign(file, {
    url: url ?? URL.createObjectURL(file),
  });
  return fileWithUrl;
}