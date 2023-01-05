import { httpClient } from 'helpers';
import { Meetup, NewMeetup } from 'model';

export const getMeetups = async (): Promise<Meetup[]> => {
  return await httpClient.get('/meetups');
};

export const getMeetup = async (id: string): Promise<Meetup> => {
  return await httpClient.get(`/meetups/${id}`);
};

export const createMeetup = async (
  newMeetupData: NewMeetup,
): Promise<Meetup> => {
  const createdMeetup: Meetup = await httpClient.post('/meetups', {
    data: newMeetupData,
  });
  return createdMeetup;
};

export const updateMeetup = async (
  updatedMeetupData: Meetup,
): Promise<Meetup> => {
  const updatedMeetup: Meetup = await httpClient.put('/meetups', {
    data: updatedMeetupData,
  });
  return updatedMeetup;
};

export const deleteMeetup = async (id: string): Promise<void> => {
  await httpClient.delete(`/meetups/${id}`);
};
