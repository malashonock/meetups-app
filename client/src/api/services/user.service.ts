import { httpClient } from 'api';
import { IUser } from 'model';

export const getUsers = async (): Promise<IUser[]> => {
  const { data: users } = await httpClient.get<IUser[]>('/users');
  return users;
};

export const getUser = async (id: string): Promise<IUser> => {
  const { data: user } = await httpClient.get<IUser>(`/users/${id}`);
  return user;
};

export const getVotedUsers = async (meetupId: string): Promise<IUser[]> => {
  const { data: votedUsers } = await httpClient.get<IUser[]>(
    `/meetups/${meetupId}/votedusers`,
  );
  return votedUsers;
};

export const getParticipants = async (meetupId: string): Promise<IUser[]> => {
  const { data: participants } = await httpClient.get<IUser[]>(
    `/meetups/${meetupId}/participants`,
  );
  return participants;
};
