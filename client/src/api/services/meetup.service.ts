import { httpClient } from 'api';
import { MeetupDto, MeetupFields, MeetupStatus, IMeetup, IUser } from 'model';

export const getMeetups = async (): Promise<IMeetup[]> => {
  const { data: meetupsData } = await httpClient.get<MeetupDto[]>('/meetups');
  return meetupsData.map(getIMeetupFromJson);
};

export const getMeetup = async (id: string): Promise<IMeetup> => {
  const { data: meetupData } = await httpClient.get<MeetupDto>(
    `/meetups/${id}`,
  );
  return getIMeetupFromJson(meetupData);
};

export const createMeetup = async (
  newMeetupFields: MeetupFields,
): Promise<IMeetup> => {
  const formData = buildMeetupFormData(newMeetupFields);

  const { data: createdMeetupData } = await httpClient.post<MeetupDto>(
    '/meetups',
    formData,
  );

  return getIMeetupFromJson(createdMeetupData);
};

export const updateMeetup = async (
  id: string,
  updatedMeetupFields: Partial<MeetupFields>,
  meetupStatus?: MeetupStatus,
): Promise<IMeetup> => {
  const formData = buildMeetupFormData(updatedMeetupFields, meetupStatus);

  const { data: updatedMeetupData } = await httpClient.patch<MeetupDto>(
    `/meetups/${id}`,
    formData,
  );

  return getIMeetupFromJson(updatedMeetupData);
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};

export const getVotedUsers = async (meetupId: string): Promise<IUser[]> => {
  const { data: votedUsers } = await httpClient.get<IUser[]>(
    `/meetups/${meetupId}/votedusers`,
  );
  return votedUsers;
};

export const voteForMeetup = async (meetupId: string): Promise<IUser[]> => {
  const { data: updatedVotedUsers } = await httpClient.post(
    `/meetups/${meetupId}/votedusers`,
  );
  return updatedVotedUsers;
};

export const withdrawVoteForMeetup = async (
  meetupId: string,
): Promise<IUser[]> => {
  const { data: updatedVotedUsers } = await httpClient.delete(
    `/meetups/${meetupId}/votedusers`,
  );
  return updatedVotedUsers;
};

export const getParticipants = async (meetupId: string): Promise<IUser[]> => {
  const { data: participants } = await httpClient.get<IUser[]>(
    `/meetups/${meetupId}/participants`,
  );
  return participants;
};

export const joinMeetup = async (meetupId: string): Promise<IUser[]> => {
  const { data: updatedParticipants } = await httpClient.post(
    `/meetups/${meetupId}/participants`,
  );
  return updatedParticipants;
};

export const cancelJoinMeetup = async (meetupId: string): Promise<IUser[]> => {
  const { data: updatedParticipants } = await httpClient.delete(
    `/meetups/${meetupId}/participants`,
  );
  return updatedParticipants;
};

const getIMeetupFromJson = (meetupData: MeetupDto): IMeetup => {
  const {
    modified: modifiedDateString,
    start: startDateString,
    finish: finishDateString,
    ...otherMeetupData
  } = meetupData;

  return {
    modified: new Date(modifiedDateString),
    start: startDateString ? new Date(startDateString) : undefined,
    finish: finishDateString ? new Date(finishDateString) : undefined,
    ...otherMeetupData,
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
