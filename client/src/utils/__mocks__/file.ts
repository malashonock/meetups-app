import { FileWithUrl } from 'types';

export const getFileWithUrl = (file: File, url?: string): FileWithUrl => ({
  ...file,
  url: url ?? 'http://localhost/test-url',
});
