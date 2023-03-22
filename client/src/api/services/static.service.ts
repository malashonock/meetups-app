import { httpClient } from 'api';
import { FileWithUrl } from 'types';
import { getFileWithUrl } from 'utils';

export const getStaticFile = async (url: string): Promise<FileWithUrl> => {
  const { data: file } = await httpClient.get<File>(url, {
    responseType: 'blob',
  });
  return getFileWithUrl(file);
};
