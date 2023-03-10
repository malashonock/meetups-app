import { AppError, NotFoundError } from 'model';
import { News } from 'stores';
import { Maybe, Optional } from 'types';
import { useNewsStore } from './useNewsStore';

interface UseNewsArticleResult {
  newsArticle?: News;
  isLoading?: boolean;
  isError?: boolean;
  errors?: AppError[];
}

export const useNewsArticle = (id: Maybe<string>): UseNewsArticleResult => {
  const { newsStore } = useNewsStore();

  const newsArticle = id ? newsStore?.findNewsArticle(id) : undefined;

  let isLoading: Optional<boolean> = undefined;
  let isError: Optional<boolean> = undefined;
  let errors: Optional<AppError[]> = undefined;

  isLoading = newsArticle?.isLoading ?? newsStore?.isLoading;

  if (newsStore && newsStore.isInitialized && !newsArticle) {
    isError = true;
    errors = [new NotFoundError()];
  } else {
    isError = newsArticle?.isError;
    errors = newsArticle?.errors;
  }

  return {
    newsArticle,
    isLoading,
    isError,
    errors,
  };
};
