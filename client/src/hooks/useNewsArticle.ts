import { News } from 'stores';
import { Maybe, Optional } from 'types';
import { useNewsStore } from 'hooks';

export const useNewsArticle = (id: Maybe<string>): Optional<News> => {
  const newsStore = useNewsStore();
  return id ? newsStore.findNewsArticle(id) : undefined;
};
