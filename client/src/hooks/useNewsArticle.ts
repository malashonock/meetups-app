import { News } from 'stores';
import { Maybe } from 'types';
import { useNewsStore } from 'hooks';

interface UseNewsArticleResult {
  newsArticle?: News;
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
}

export const useNewsArticle = (id: Maybe<string>): UseNewsArticleResult => {
  const newsStore = useNewsStore();

  if (!id) {
    return {};
  }

  const newsArticle = newsStore?.findNewsArticle(id);
  const isLoading = newsArticle?.isLoading;
  const isError = newsArticle?.isError;
  const errors = newsArticle?.errors;

  return {
    newsArticle,
    isLoading,
    isError,
    errors,
  };
};
