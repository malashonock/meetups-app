import { News } from 'stores';
import { useNewsStore } from 'hooks';
import { Maybe, Optional } from 'types';

export const useNewsArticle = (id: Maybe<string>): Optional<News> => {
  const newsStore = useNewsStore();
  return id ? newsStore.findNewsArticle(id) : undefined;
};
