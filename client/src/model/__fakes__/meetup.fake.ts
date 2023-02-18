import { faker } from '@faker-js/faker';

import { IMeetup, MeetupFields, MeetupStatus, ShortUser } from 'model';
import { Meetup, MeetupStore, RootStore } from 'stores';
import {
  mockImageWithUrl,
  mockShortUser2Data,
  mockShortUserData,
  mockUser,
  mockUsers,
  mockUsersData,
} from 'model/__fakes__';
import { generateArray } from 'utils';

export const mockTopicFields: MeetupFields = {
  subject: 'Test meetup topic',
  excerpt: 'Test meetup description',
  author: mockShortUserData,
  start: undefined,
  finish: undefined,
  place: undefined,
  image: null,
};

export const mockMeetupFields: MeetupFields = {
  ...mockTopicFields,
  start: new Date(2023, 2, 15, 14, 0),
  finish: new Date(2023, 2, 15, 15, 30),
  place: 'room 123',
  image: mockImageWithUrl,
};

export const mockTopicData: IMeetup = {
  ...mockTopicFields,
  id: 'aaa',
  modified: new Date(2023, 0, 10),
  speakers: [mockShortUserData],
  votedUsers: [mockShortUserData, mockShortUser2Data],
  participants: [mockShortUserData, mockShortUser2Data],
  status: MeetupStatus.REQUEST,
};

export const mockMeetupDraftData: IMeetup = {
  ...mockTopicData,
  status: MeetupStatus.DRAFT,
};

export const mockMeetupDraftFilledData: IMeetup = {
  ...mockMeetupDraftData,
  ...mockMeetupFields,
};

export const mockMeetupData: IMeetup = {
  ...mockMeetupDraftFilledData,
  status: MeetupStatus.CONFIRMED,
};

const mockRootStore: RootStore = new RootStore();
mockRootStore.userStore.users = [...mockUsers];
export const mockMeetupStore = new MeetupStore(mockRootStore);

export const mockTopic: Meetup = new Meetup(mockTopicData, mockMeetupStore);
export const mockMeetupDraft = new Meetup(mockMeetupDraftData, mockMeetupStore);
export const mockMeetupDraftFilled = new Meetup(
  mockMeetupDraftFilledData,
  mockMeetupStore,
);
export const mockMeetup = new Meetup(mockMeetupData, mockMeetupStore);

export const generateMeetupData = (
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): IMeetup => {
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
    max: Math.min(3, mockUsersData.length),
  });
  const randomVotedUsersCount = faker.datatype.number({
    min: 0,
    max: Math.min(100, mockUsersData.length),
  });
  const randomParticipantsCount = faker.datatype.number({
    min: 0,
    max: Math.min(100, mockUsersData.length),
  });

  return {
    id: faker.datatype.uuid(),
    modified: faker.date.recent(),
    start: randomStartDate,
    finish: randomFinishDate,
    author: mockUser,
    speakers: generateArray(randomSpeakersCount, () =>
      faker.helpers.arrayElement(mockUsersData),
    ),
    votedUsers: generateArray(randomVotedUsersCount, () =>
      faker.helpers.arrayElement(mockUsersData),
    ),
    participants: generateArray(randomParticipantsCount, () =>
      faker.helpers.arrayElement(mockUsersData),
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
  };
};

export const generateMeetupsData = (
  count: number,
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): IMeetup[] => {
  return generateArray<IMeetup>(count, () =>
    generateMeetupData(status, dateConstraint),
  );
};

export const generateMeetup = (
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): Meetup =>
  new Meetup(generateMeetupData(status, dateConstraint), mockMeetupStore);

export const generateMeetups = (
  count: number,
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): Meetup[] => {
  return generateArray<Meetup>(count, () =>
    generateMeetup(status, dateConstraint),
  );
};

export const mapMeetupsData = (
  meetupsData: IMeetup[],
  meetupStore: MeetupStore,
): Meetup[] =>
  meetupsData.map(
    (meetupData: IMeetup): Meetup => new Meetup(meetupData, meetupStore),
  );
