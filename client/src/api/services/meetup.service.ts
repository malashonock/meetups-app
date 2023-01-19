import { getVotedUsers } from 'api';
import { httpClient } from 'api';
import { Meetup, NewMeetup } from 'model';

export const getMeetups = async (): Promise<Meetup[]> => {
  const { data: meetups } = await httpClient.get<Meetup[]>('/meetups');
  return meetups;
};

export const getMeetup = async (id: string): Promise<Meetup> => {
  const { data: meetup } = await httpClient.get<Meetup>(`/meetups/${id}`);
  const votedUsers = await getVotedUsers(id);

  return {
    ...meetup,
    votedUsers,
  };
};

export const createMeetup = async (
  newMeetupData: NewMeetup,
): Promise<Meetup> => {
  const { data: createdMeetup } = await httpClient.post<Meetup>('/meetups', {
    ...newMeetupData,
  });
  return createdMeetup;
};

export const updateMeetup = async (
  updatedMeetupData: Meetup,
): Promise<Meetup> => {
  const { data: updatedMeetup } = await httpClient.put<Meetup>('/meetups', {
    ...updatedMeetupData,
  });
  return updatedMeetup;
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};
