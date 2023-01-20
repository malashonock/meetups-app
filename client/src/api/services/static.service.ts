import { httpClient } from 'api';

export const getStaticFile = async (url: string): Promise<File> => {
  const response = await httpClient.get<File>(url, {
    responseType: 'blob',
  });
  const { data: file } = response;
  return file;
};
