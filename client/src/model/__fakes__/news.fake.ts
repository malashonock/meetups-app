import { faker } from '@faker-js/faker';
import { INews, NewsDto, NewsFields } from 'model/news.model';

import { News, NewsStore, RootStore } from 'stores';
import { generateArray } from 'utils';
import { mockImageWithUrl, mockImageWithUrl2 } from 'model/__fakes__';

const mockNewsStore = new NewsStore(new RootStore());

export const mockNewsArticleFields: NewsFields = {
  title: 'Test news title',
  text: 'Test news text',
  image: mockImageWithUrl,
};

export const mockUpdatedNewsArticleFields: NewsFields = {
  title: 'Updated news title',
  text: 'Updated news text',
  image: mockImageWithUrl2,
};

export const mockNewsArticleData: INews = {
  id: 'aaa',
  publicationDate: new Date(2023, 0, 10),
  ...mockNewsArticleFields,
};

export const mockUpdatedNewsArticleData: INews = {
  ...mockNewsArticleData,
  ...mockUpdatedNewsArticleFields,
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

export const mockNewsArticleDto: NewsDto = {
  id: mockNewsArticleData.id,
  publicationDate: mockNewsArticleData.publicationDate.toISOString(),
  title: mockNewsArticleData.title,
  text: mockNewsArticleData.text,
  imageUrl: mockNewsArticleData.image!.url,
};

export const mockUpdatedNewsArticleDto: NewsDto = {
  id: mockUpdatedNewsArticleData.id,
  publicationDate: mockUpdatedNewsArticleData.publicationDate.toISOString(),
  title: mockUpdatedNewsArticleData.title,
  text: mockUpdatedNewsArticleData.text,
  imageUrl: mockUpdatedNewsArticleData.image!.url,
};

export const mockNewsArticle2Dto: NewsDto = {
  id: mockNewsArticle2Data.id,
  publicationDate: mockNewsArticle2Data.publicationDate.toISOString(),
  title: mockNewsArticle2Data.title,
  text: mockNewsArticle2Data.text,
  imageUrl: mockNewsArticle2Data.image!.url,
};

export const mockNewsDto: NewsDto[] = [mockNewsArticleDto, mockNewsArticle2Dto];

export const mockNewsArticle: News = new News(
  mockNewsArticleData,
  mockNewsStore,
);

export const mockUpdatedNewsArticle: News = new News(
  mockUpdatedNewsArticleData,
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
