import { faker } from '@faker-js/faker';

import { News } from 'stores';
import { generateArray } from 'utils';
import { mockImageWithUrl } from './file.fake';

export const mockNewsArticle: News = new News({
  id: 'aaa',
  publicationDate: new Date(2023, 0, 10),
  title: 'Test news title',
  text: 'Test news text',
  image: mockImageWithUrl,
});

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
