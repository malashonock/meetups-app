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

const getNewsArticleDtoFromData = (newsArticleData: INews): NewsDto => ({
  id: newsArticleData.id,
  publicationDate: newsArticleData.publicationDate.toISOString(),
  title: newsArticleData.title,
  text: newsArticleData.text,
  imageUrl: newsArticleData.image!.url,
});

export const mockNewsArticleDto: NewsDto =
  getNewsArticleDtoFromData(mockNewsArticleData);
export const mockUpdatedNewsArticleDto: NewsDto = getNewsArticleDtoFromData(
  mockUpdatedNewsArticleData,
);
export const mockNewsArticle2Dto: NewsDto =
  getNewsArticleDtoFromData(mockNewsArticle2Data);

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
