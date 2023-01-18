import faker from "faker";
import {fixedUsers, getRandomUser} from "./users.mjs";
import { downloadFile, getUrlFromPublicPath } from '../utils.mjs';
import path from 'path';
import { PUBLIC_DIR } from '../constants.mjs';

const DOWNLOAD_DIR = path.join(PUBLIC_DIR, 'assets', 'images');

const convertToShortUser = (user) => {
  const { id, name, surname } = user
  return { id, name, surname };
}
const getShortUser = (users) => {
  return convertToShortUser( getRandomUser(users) );
};

export const fixedMeetups = [
  {
    id: "aaa-aaa-aaa-aaa",
    modified: "2021-08-27T04:38:33.816Z",
    start: "2022-06-09T23:35:47.068Z",
    finish: "2022-06-10T02:51:47.068Z",
    author: convertToShortUser(fixedUsers[0]),
    speakers: [
      convertToShortUser(fixedUsers[0])
    ],
    subject: "Reverse-engineered even-keeled standardization",
    excerpt:
      "Nemo pariatur dolores ut vero velit non. Quidem temporibus quod nihil amet recusandae atque provident voluptatum iste. Aut architecto cum sit rerum aliquam maxime. Ratione voluptate optio id molestias quia quidem ipsam. Eius voluptatem quia dolores enim assumenda. Consequuntur cupiditate error earum hic est numquam vero.",
    place: "630 Goyette Causeway",
    goCount: 64,
    status: "CONFIRMED",
    imageUrl: 'http://localhost:8080/assets/images/news1.jpg',
    meta: {}
  },
];

const generateMeetup = async (users) => {
  const start = faker.date.future();
  const goCount = faker.datatype.number({ min: 1, max: users.length - 10 });
  const finish = new Date(
    start.getTime() + faker.datatype.number({ min: 15, max: 240 }) * 60 * 1000
  );
  const imagePath = await downloadFile(faker.image.people(640, 480, true), DOWNLOAD_DIR);
  const imageUrl = getUrlFromPublicPath(imagePath);

  return {
    id: faker.datatype.uuid(),
    modified: faker.date.past(),
    start,
    finish,
    author: getShortUser(users),
    speakers: [getShortUser(users)],
    subject: faker.company.catchPhrase(),
    excerpt: faker.lorem.paragraph(),
    place: faker.address.streetAddress(),
    goCount,
    status: faker.random.arrayElement(["DRAFT", "REQUEST", "CONFIRMED"]),
    imageUrl,
    meta: {}
  };
};

export const generateMeetups = async (count, users) => {
  return await Promise.all(
    Array.from({ length: count }, async () => {
      return await generateMeetup(users);
    })
  );
};

export const generateShortUsers = (meetups, users) => {
  const shortUsers = meetups.reduce((res, meetup) => {
    res[meetup.id] = users
      // ~30% chance that the user will be added
      .filter(() => Math.random() > 0.7)
      .map(u => ({ id: u.id, name: u.name, surname: u.surname }));

    return res;
  }, {});

  return shortUsers;
};
