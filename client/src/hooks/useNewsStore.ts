import { useContext } from 'react';

import { News, NewsStore } from 'stores';
import { RootContext } from 'components';
import { NewsFields } from 'model';
import { Optional } from 'types';

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
