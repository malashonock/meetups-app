import { useContext, useEffect } from 'react';

import { News, NewsStore } from 'stores';
import { NewsFields } from 'model';
import { Optional } from 'types';
import { RootContext } from 'components';

export interface UseNewsStoreResult {
  newsStore?: NewsStore;
  news?: News[];
  isLoading?: boolean;
  isError?: boolean;
  errors?: unknown[];
  createNewsArticle?: (newsArticleData: NewsFields) => Promise<Optional<News>>;
  findNewsArticle?: (id: string) => Optional<News>;
}

export const useNewsStore = (): UseNewsStoreResult => {
  const newsStore = useContext(RootContext)?.newsStore;
  const news = newsStore?.news;
  const isLoading = newsStore?.isLoading;
  const isError = newsStore?.isError;
  const errors = newsStore?.errors;
  const createNewsArticle = newsStore?.createNewsArticle;
  const findNewsArticle = newsStore?.findNewsArticle;

  // Hydrate news store on first load
  useEffect((): void => {
    (async (): Promise<void> => {
      await newsStore?.loadNews();
    })();
  }, [newsStore]);

  return {
    newsStore,
    news,
    isLoading,
    isError,
    errors,
    createNewsArticle,
    findNewsArticle,
  };
};
