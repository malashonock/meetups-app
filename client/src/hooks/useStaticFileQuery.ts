import { getStaticFile } from 'api';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface UseStaticFileQueryResult {
  file?: File;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useStaticFileQuery = (
  url: string | null | undefined,
): UseStaticFileQueryResult => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!url) {
        setIsError(true);
        setError('Не задан URL-адрес файла!');
        return;
      }

      setIsLoading(true);

      try {
        setFile(await getStaticFile(url));
        setIsSuccess(true);
      } catch (error) {
        setIsError(true);

        const status = (error as AxiosError).response?.status;
        switch (status) {
          case 404:
            setError('Файл не найден!');
            setFile(undefined);
            break;
          default:
            setError('Что-то пошло не так!');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url]);

  return {
    file,
    error,
    isLoading,
    isSuccess,
    isError,
  };
};
