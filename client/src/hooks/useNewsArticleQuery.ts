import { getNewsArticle } from 'api';
import { AxiosError } from 'axios';
import { News } from 'model';
import { useEffect, useState } from 'react';

interface UseNewsArticleQueryResult {
  newsArticle?: News;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useNewsArticleQuery = (
  id: string | null | undefined,
): UseNewsArticleQueryResult => {
  const [newsArticle, setNewsArticle] = useState<News | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!id) {
        setIsError(true);
        setError('Не задан id новости!');
        return;
      }

      setIsLoading(true);

      try {
        setNewsArticle(await getNewsArticle(id));
        setIsSuccess(true);
      } catch (error) {
        setIsError(true);

        const status = (error as AxiosError).response?.status;
        switch (status) {
          case 404:
            setError('Новость не найдена!');
            break;
          default:
            setError('Что-то пошло не так!');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return {
    newsArticle,
    error,
    isLoading,
    isSuccess,
    isError,
  };
};
