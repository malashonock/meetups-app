import { getVotedUsers } from 'api';
import { httpClient } from 'api';
import { MeetupDto, MeetupFields } from 'model';

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
  newMeetupData: MeetupFields,
): Promise<MeetupDto> => {
  const formData = new FormData();

  Object.entries(newMeetupData).forEach(([name, value]) => {
    let valueToSend: string | File;

    switch (typeof value) {
      case 'string':
        if (name === 'author') {
          valueToSend = JSON.stringify({
            id: 'uuu-bbb',
            name: 'chief',
            surname: 'Blick',
          });
          break;
        }

        valueToSend = value;
        break;
      case 'object':
        if (value instanceof File) {
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

  const { data: createdMeetup } = await httpClient.post<MeetupDto>(
    '/meetups',
    formData,
  );
  return createdMeetup;
};

export const updateMeetup = async (
  updatedMeetupData: MeetupDto,
): Promise<MeetupDto> => {
  const { data: updatedMeetup } = await httpClient.put<MeetupDto>('/meetups', {
    ...updatedMeetupData,
  });
  return updatedMeetup;
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};
