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

export const mockTopicDto: MeetupDto = {
  ...mockTopicFields,
  author: mockTopicFields.author!,
  id: 'aaa',
  modified: new Date(2023, 0, 10).toISOString(),
  start: mockTopicFields.start?.toISOString(),
  finish: mockTopicFields.start?.toISOString(),
  speakers: [mockUserData],
  votedUsers: [mockUserData, mockUser2Data],
  participants: [mockUserData, mockUser2Data],
  status: MeetupStatus.REQUEST,
  imageUrl: mockTopicFields.image?.url ?? null,
};

export const mockMeetupDraftDto: MeetupDto = {
  ...mockTopicDto,
  status: MeetupStatus.DRAFT,
};

export const mockMeetupDraftFilledDto: MeetupDto = {
  ...mockMeetupDraftDto,
  ...mockMeetupFields,
  start: mockMeetupFields.start?.toISOString(),
  finish: mockMeetupFields.start?.toISOString(),
  imageUrl: mockMeetupFields.image?.url ?? null,
};

export const mockMeetupDto: MeetupDto = {
  ...mockMeetupDraftFilledDto,
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

export const mockMeetupStore = new MeetupStore(new RootStore());

export const mockTopic: Meetup = new Meetup(mockTopicDto, mockMeetupStore);
export const mockMeetupDraft = new Meetup(mockMeetupDraftDto, mockMeetupStore);
export const mockMeetupDraftFilled = new Meetup(
  mockMeetupDraftFilledDto,
  mockMeetupStore,
);
export const mockMeetup = new Meetup(mockMeetupDto, mockMeetupStore);

export const generateMeetupDto = (
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): MeetupDto => {
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
    modified: faker.date.recent().toISOString(),
    start: randomStartDate.toISOString(),
    finish: randomFinishDate.toISOString(),
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
    imageUrl: mockImageWithUrl.url,
  };
};

export const generateMeetupsData = (
  count: number,
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): MeetupDto[] => {
  return generateArray<MeetupDto>(count, () =>
    generateMeetupDto(status, dateConstraint),
  );
};

export const generateMeetup = (
  status?: MeetupStatus,
  dateConstraint?: 'upcoming' | 'finished',
): Meetup =>
  new Meetup(generateMeetupDto(status, dateConstraint), mockMeetupStore);

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
  meetupsData: MeetupDto[],
  meetupStore: MeetupStore,
): Meetup[] =>
  meetupsData.map(
    (meetupData: MeetupDto): Meetup => new Meetup(meetupData, meetupStore),
  );
