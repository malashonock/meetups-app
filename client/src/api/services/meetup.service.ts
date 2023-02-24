import { getParticipants, getStaticFile, getVotedUsers } from 'api';
import { httpClient } from 'api';
import { MeetupDto, MeetupFields, MeetupStatus, IMeetup } from 'model';

export const getMeetups = async (): Promise<MeetupDto[]> => {
  const { data: meetupsData } = await httpClient.get<MeetupDto[]>('/meetups');
  return meetupsData;
};

export const getMeetup = async (id: string): Promise<MeetupDto> => {
  const { data: meetupData } = await httpClient.get<MeetupDto>(
    `/meetups/${id}`,
  );
  return meetupData;
};

export const createMeetup = async (
  newMeetupFields: MeetupFields,
): Promise<MeetupDto> => {
  const formData = buildMeetupFormData(newMeetupFields);

  const { data: createdMeetupData } = await httpClient.post<MeetupDto>(
    '/meetups',
    formData,
  );

  return createdMeetupData;
};

export const updateMeetup = async (
  id: string,
  updatedMeetupFields: Partial<MeetupFields>,
  meetupStatus?: MeetupStatus,
): Promise<MeetupDto> => {
  const formData = buildMeetupFormData(updatedMeetupFields, meetupStatus);

  const { data: updatedMeetupData } = await httpClient.patch<MeetupDto>(
    `/meetups/${id}`,
    formData,
  );

  return updatedMeetupData;
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};

const buildMeetupFormData = (
  meetupFields: Partial<MeetupFields>,
  meetupStatus?: MeetupStatus,
): FormData => {
  const formData = new FormData();

  formData.append('modified', new Date().toISOString());

  if (meetupStatus) {
    formData.append('status', meetupStatus);
  }

  Object.entries(meetupFields).forEach(([name, value]): void => {
    let valueToAppend: string | Blob | undefined = undefined;

    switch (name) {
      case 'start':
      case 'finish':
        valueToAppend = (value as Date)?.toISOString();
        break;
      case 'author':
      case 'speakers':
        valueToAppend = JSON.stringify(value);
        break;
      default:
        if (value !== null && value !== undefined) {
          valueToAppend = value as string | Blob;
        }
        break;
    }

    if (valueToAppend) {
      formData.append(name, valueToAppend);
    }
  });

  return formData;
};
