import { httpClient } from 'api';
import { MeetupDto, MeetupFields, MeetupStatus, IMeetup } from 'model';

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
