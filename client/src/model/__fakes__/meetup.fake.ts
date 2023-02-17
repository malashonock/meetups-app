import { faker } from '@faker-js/faker';

import { MeetupStatus, ShortUser } from 'model';
import { Meetup, MeetupStore, RootStore } from 'stores';
import { mockImageWithUrl, mockUser, mockUsers } from 'model/__fakes__';
import { generateArray } from 'utils';

const mockRootStore: RootStore = new RootStore();
mockRootStore.userStore.users = [...mockUsers];

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
  new MeetupStore(mockRootStore),
);

export const mockMeetupDraft = new Meetup(
  {
    ...mockTopic,
    status: MeetupStatus.DRAFT,
  },
  new MeetupStore(mockRootStore),
);

export const mockMeetupDraftFilled = new Meetup(
  {
    ...mockMeetupDraft,
    start: new Date(2023, 2, 15, 14, 0),
    finish: new Date(2023, 2, 15, 15, 30),
    place: 'room 123',
    image: mockImageWithUrl,
  },
  new MeetupStore(mockRootStore),
);

export const mockMeetup = new Meetup(
  {
    ...mockMeetupDraftFilled,
    status: MeetupStatus.CONFIRMED,
  },
  new MeetupStore(mockRootStore),
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

  const randomSpeakersCount = faker.datatype.number({
    min: 1,
    max: Math.min(3, mockUsers.length),
  });
  const randomVotedUsersCount = faker.datatype.number({
    min: 0,
    max: Math.min(100, mockUsers.length),
  });
  const randomParticipantsCount = faker.datatype.number({
    min: 0,
    max: Math.min(100, mockUsers.length),
  });

  return new Meetup(
    {
      id: faker.datatype.uuid(),
      modified: faker.date.recent(),
      start: randomStartDate,
      finish: randomFinishDate,
      author: mockUser,
      speakers: generateArray(randomSpeakersCount, () =>
        faker.helpers.arrayElement(mockUsers),
      ),
      votedUsers: generateArray(randomVotedUsersCount, () =>
        faker.helpers.arrayElement(mockUsers),
      ),
      participants: generateArray(randomParticipantsCount, () =>
        faker.helpers.arrayElement(mockUsers),
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
    },
    new MeetupStore(mockRootStore),
  );
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
