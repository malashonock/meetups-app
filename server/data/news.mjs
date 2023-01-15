import faker from 'faker';
import { downloadFile, getUrlFromPublicPath } from '../utils.mjs';
import path from 'path';
import { PUBLIC_DIR } from '../constants.mjs';

const DOWNLOAD_DIR = path.join(PUBLIC_DIR, 'assets', 'images');

export const fixedNews = [
  {
    id: '2de0306f-a712-4078-b1f0-b223c2f4246b',
    publicationDate: '2021-08-27T04:38:33.816Z',
    title: 'Our Vilnius office celebrates 1 year!',
    text:
      '🙌 The SaM Solutions office in #Vilnius celebrates a one-year anniversary.' +
      ' 🎉 Congratulations to our colleagues! Keep it up! More new victories and achievements ahead. 💪 #SaMSolutions',
    imageUrl: 'http://localhost:8080/assets/images/news1.jpg',
  },
];

const createNews = async () => {
  const imagePath = await downloadFile(faker.image.people(640, 480, true), DOWNLOAD_DIR);
  const imageUrl = getUrlFromPublicPath(imagePath);

  const randomNews = {
    id: faker.datatype.uuid(),
    publicationDate: faker.date.between('2020-01-01', '2021-12-12'),
    title: faker.company.catchPhrase(),
    text: faker.lorem.paragraphs(3),
    imageUrl,
  };

  return randomNews;
};

export const generateNews = async (count) => {
  return await Promise.all(
    Array.from({ length: count }, async () => {
      return await createNews();
    })
  );
};
