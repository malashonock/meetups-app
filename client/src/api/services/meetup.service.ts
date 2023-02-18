import { getParticipants, getStaticFile, getVotedUsers } from 'api';
import { httpClient } from 'api';
import { MeetupDto, MeetupFields, MeetupStatus, IMeetup } from 'model';

export const getMeetups = async (): Promise<IMeetup[]> => {
  const { data: meetupsData } = await httpClient.get<MeetupDto[]>('/meetups');
  return Promise.all(meetupsData.map(getMeetupFromJson));
};

export const getMeetup = async (id: string): Promise<IMeetup> => {
  const { data: meetupData } = await httpClient.get<MeetupDto>(
    `/meetups/${id}`,
  );
  return getMeetupFromJson(meetupData);
};

export const createMeetup = async (
  newMeetupFields: MeetupFields,
): Promise<IMeetup> => {
  const formData = buildMeetupFormData(newMeetupFields);

  const { data: createdMeetup } = await httpClient.post<MeetupDto>(
    '/meetups',
    formData,
  );

  return getMeetupFromJson(createdMeetup);
};

export const updateMeetup = async (
  id: string,
  updatedMeetupFields: Partial<MeetupFields>,
  meetupStatus?: MeetupStatus,
): Promise<IMeetup> => {
  const formData = buildMeetupFormData(updatedMeetupFields, meetupStatus);

  const { data: updatedMeetup } = await httpClient.patch<MeetupDto>(
    `/meetups/${id}`,
    formData,
  );

  return getMeetupFromJson(updatedMeetup);
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};

const getMeetupFromJson = async (meetupData: MeetupDto): Promise<IMeetup> => {
  const {
    id,
    subject,
    excerpt,
    status,
    modified,
    start,
    finish,
    place,
    author,
    speakers,
    imageUrl,
  } = meetupData;

  const image = imageUrl ? await getStaticFile(imageUrl) : null;
  const votedUsers = await getVotedUsers(id);
  const participants = await getParticipants(id);

  return {
    id,
    subject,
    excerpt,
    status,
    modified: new Date(modified),
    start: start ? new Date(start) : undefined,
    finish: finish ? new Date(finish) : undefined,
    place,
    author,
    speakers,
    votedUsers,
    participants,
    image,
  };
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
