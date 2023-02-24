import { faker } from '@faker-js/faker';

import { IMeetup, MeetupDto, MeetupFields, MeetupStatus, IUser } from 'model';
import { Meetup, MeetupStore, RootStore } from 'stores';
import {
  mockImageWithUrl,
  mockUser2Data,
  mockUserData,
  mockUsersData,
} from 'model/__fakes__';
import { generateArray } from 'utils';

export const mockTopicFields: MeetupFields = {
  subject: 'Test meetup topic',
  excerpt: 'Test meetup description',
  author: mockUserData,
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
  author: mockTopicFields.author!,
  id: 'aaa',
  modified: new Date(2023, 0, 10),
  speakers: [mockUserData],
  votedUsers: [mockUserData, mockUser2Data],
  participants: [mockUserData, mockUser2Data],
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

export const getMeetupDtoFromData = (meetupData: IMeetup): MeetupDto => ({
  id: meetupData.id,
  modified: meetupData.modified.toISOString(),
  start: meetupData.start?.toISOString(),
  finish: meetupData.finish?.toISOString(),
  author: meetupData.author,
  speakers: meetupData.speakers,
  votedUsers: meetupData.votedUsers,
  participants: meetupData.participants,
  subject: meetupData.subject,
  excerpt: meetupData.excerpt,
  place: meetupData.place,
  status: meetupData.status,
  imageUrl: meetupData.image?.url ?? null,
});

export const mockTopicDto: MeetupDto = getMeetupDtoFromData(mockTopicData);
export const mockMeetupDraftDto: MeetupDto =
  getMeetupDtoFromData(mockMeetupDraftData);
export const mockMeetupDraftFilledDto: MeetupDto = getMeetupDtoFromData(
  mockMeetupDraftFilledData,
);
export const mockMeetupDto: MeetupDto = getMeetupDtoFromData(mockMeetupData);

export const mockMeetupStore = new MeetupStore(new RootStore());

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
    author: mockUserData,
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
