import { getVotedUsers } from 'api';
import { httpClient } from 'api';
import {
  MeetupDto,
  MeetupFields,
  MeetupFormData,
  MeetupStatus,
  ShortUser,
} from 'model';

export const getMeetups = async (): Promise<MeetupDto[]> => {
  const { data: meetups } = await httpClient.get<MeetupDto[]>('/meetups');
  return meetups;
};

export const getMeetup = async (id: string): Promise<MeetupDto> => {
  const { data: meetup } = await httpClient.get<MeetupDto>(`/meetups/${id}`);
  const votedUsers = await getVotedUsers(id);

  return {
    ...meetup,
    votedUsers,
  };
};

export const createMeetup = async (
  newMeetupFields: MeetupFields,
): Promise<MeetupFormData> => {
  const formData = buildMeetupFormData(newMeetupFields, MeetupStatus.DRAFT);

  const { data: createdMeetup } = await httpClient.post<MeetupFormData>(
    '/meetups',
    formData,
  );

  return createdMeetup;
};

export const updateMeetup = async (
  id: string,
  updatedMeetupFields: MeetupFields,
  meetupStatus: MeetupStatus,
): Promise<MeetupFormData> => {
  const formData = buildMeetupFormData(updatedMeetupFields, meetupStatus);

  const { data: updatedMeetup } = await httpClient.put<MeetupFormData>(
    `/meetups/${id}`,
    formData,
  );

  return updatedMeetup;
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};

const buildMeetupFormData = (
  meetupFields: MeetupFields,
  meetupStatus: MeetupStatus,
): FormData => {
  // enhance form field values with missing data
  const stubUser: ShortUser = {
    id: 'uuu-bbb',
    name: 'chief',
    surname: 'Blick',
  };

  const newMeetupData: MeetupFormData = {
    ...meetupFields,
    ...{
      status: meetupStatus,
      modified: new Date(),
      author: stubUser,
      goCount: 0,
      speakers: [stubUser],
      votedUsers: [],
    },
  };

  const formData = new FormData();

  Object.entries(newMeetupData).forEach(([name, value]) => {
    let valueToSend: string | File | Blob;

    switch (typeof value) {
      case 'string':
        valueToSend = value;
        break;
      case 'object':
        if (value instanceof File || value instanceof Blob) {
          valueToSend = value;
          break;
        }

        if (value instanceof Date) {
          valueToSend = value.toISOString();
          break;
        }

        valueToSend = JSON.stringify(value);
        break;
      default:
        valueToSend = value.toString();
        break;
    }

    if (valueToSend !== null && value !== undefined) {
      formData.append(name, valueToSend);
    }
  });

  return formData;
};
