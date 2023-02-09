import { useContext } from 'react';

import { News, NewsStore } from 'stores';
import { RootContext } from 'components';
import { NewsFields } from 'model';
import { Optional } from 'types';

export interface UseNewsStoreResult {
  newsStore?: NewsStore;
  news?: News[];
  createNewsArticle?: (newsArticleData: NewsFields) => Promise<News>;
  findNewsArticle?: (id: string) => Optional<News>;
}

export const useNewsStore = (): UseNewsStoreResult => {
  const newsStore = useContext(RootContext)?.newsStore;
  const news = newsStore?.news;
  const createNewsArticle = newsStore?.createNewsArticle;
  const findNewsArticle = newsStore?.findNewsArticle;

  return {
    newsStore,
    news,
    createNewsArticle,
    findNewsArticle,
  };
};
