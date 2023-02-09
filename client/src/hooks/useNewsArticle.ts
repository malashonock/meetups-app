import { News } from 'stores';
import { Maybe, Optional } from 'types';
import { useNewsStore } from './useNewsStore';

export const useNewsArticle = (id: Maybe<string>): Optional<News> => {
  const { newsStore } = useNewsStore();

  if (!id) {
    return undefined;
  }

  const news = newsStore?.findNewsArticle(id);

  return news;
};
