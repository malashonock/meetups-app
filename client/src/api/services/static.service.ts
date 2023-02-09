import { httpClient } from 'api';
import { FileWithUrl } from 'types';
import { getFileWithUrl } from 'utils';

export const getStaticFile = async (url: string): Promise<FileWithUrl> => {
  const response = await httpClient.get<File>(url, {
    responseType: 'blob',
  });
  const { data: file } = response;
  return getFileWithUrl(file);
};
