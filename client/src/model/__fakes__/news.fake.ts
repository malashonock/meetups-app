import { faker } from '@faker-js/faker';
import { INews, NewsFields } from 'model/news.model';

import { News, NewsStore, RootStore } from 'stores';
import { generateArray } from 'utils';
import { mockImageWithUrl, mockImageWithUrl2 } from 'model/__fakes__';

const mockNewsStore = new NewsStore(new RootStore());

export const mockNewsArticleFields: NewsFields = {
  title: 'Test news title',
  text: 'Test news text',
  image: mockImageWithUrl,
};

export const mockNewsArticleData: INews = {
  id: 'aaa',
  publicationDate: new Date(2023, 0, 10),
  ...mockNewsArticleFields,
};

export const mockNewsArticle2Data: INews = {
  id: 'bbb',
  publicationDate: new Date(2023, 2, 15),
  title: 'Test news title 2',
  text: 'Test news text 2',
  image: mockImageWithUrl2,
};

export const mockNewsData: INews[] = [
  mockNewsArticleData,
  mockNewsArticle2Data,
];

export const mockNewsArticle: News = new News(
  mockNewsArticleData,
  mockNewsStore,
);
export const mockNewsArticle2: News = new News(
  mockNewsArticle2Data,
  mockNewsStore,
);
export const mockNews: News[] = [mockNewsArticle, mockNewsArticle2];

export const generateNewsArticle = (): News =>
  new News({
    id: faker.datatype.uuid(),
    publicationDate: faker.date.recent(),
    title: faker.company.catchPhrase(),
    text: faker.lorem.paragraph(),
    image: mockImageWithUrl,
  });

export const generateNews = (count: number): News[] => {
  return generateArray<News>(count, generateNewsArticle);
};
