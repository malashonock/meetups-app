import { faker } from '@faker-js/faker';

import { MeetupStatus, ShortUser } from 'model';
import { Meetup, MeetupStore, RootStore, UserStore } from 'stores';
import {
  mockImageWithUrl,
  generateShortUser,
  generateShortUsers,
  mockUser,
} from 'model/__fakes__';
import { generateArray } from 'utils';

// Spy on UserStore.prototype.findUser(s) method
// Meetup constructor calls these to populate author, votedUsers, participants fields
jest.spyOn(UserStore.prototype, 'findUser').mockImplementation(() => mockUser);
jest
  .spyOn(UserStore.prototype, 'findUsers')
  .mockImplementation(() => [mockUser]);

export const mockTopic: Meetup = new Meetup(
  {
    id: 'aaa',
    modified: new Date(2023, 0, 10),
    start: undefined,
    finish: undefined,
    author: mockUser,
    speakers: [mockUser],
    votedUsers: generateArray<ShortUser>(3, () => mockUser),
    participants: generateArray<ShortUser>(2, () => mockUser),
    subject: 'Test meetup topic',
    excerpt: 'Test meetup description',
    place: undefined,
    status: MeetupStatus.REQUEST,
    image: null,
  },
  new MeetupStore(new RootStore()),
);

export const mockMeetupDraft = new Meetup(
  {
    ...mockTopic,
    status: MeetupStatus.DRAFT,
  },
  new MeetupStore(new RootStore()),
);

export const mockMeetupDraftFilled = new Meetup(
  {
    ...mockMeetupDraft,
    start: new Date(2023, 2, 15, 14, 0),
    finish: new Date(2023, 2, 15, 15, 30),
    place: 'room 123',
    image: mockImageWithUrl,
  },
  new MeetupStore(new RootStore()),
);

export const mockMeetup = new Meetup(
  {
    ...mockMeetupDraftFilled,
    status: MeetupStatus.CONFIRMED,
  },
  new MeetupStore(new RootStore()),
);

export const generateMeetup = (
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): Meetup => {
  let randomStartDate: Date;
  switch (dateConstraint) {
    case 'upcoming':
      randomStartDate = faker.date.future();
      break;
    case 'finished':
      randomStartDate = faker.date.recent();
      break;
    default:
      randomStartDate =
        Math.random() <= 0.75 ? faker.date.future() : faker.date.recent();
      break;
  }

  const randomFinishDate = new Date(
    randomStartDate.getTime() +
      faker.datatype.number({ min: 15, max: 240 }) * 60 * 1000,
  );

  return new Meetup({
    id: faker.datatype.uuid(),
    modified: faker.date.recent(),
    start: randomStartDate,
    finish: randomFinishDate,
    author: generateShortUser(),
    speakers: generateShortUsers(faker.datatype.number({ min: 1, max: 3 })),
    votedUsers: generateShortUsers(faker.datatype.number({ min: 0, max: 100 })),
    participants: generateShortUsers(
      faker.datatype.number({ min: 0, max: 100 }),
    ),
    subject: faker.company.catchPhrase(),
    excerpt: faker.lorem.paragraph(),
    place: faker.address.streetAddress(),
    status:
      status ??
      faker.helpers.arrayElement([
        MeetupStatus.REQUEST,
        MeetupStatus.DRAFT,
        MeetupStatus.CONFIRMED,
      ]),
    image: mockImageWithUrl,
  });
};

export const generateMeetups = (
  count: number,
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): Meetup[] => {
  return generateArray<Meetup>(count, () =>
    generateMeetup(status, dateConstraint),
  );
};
