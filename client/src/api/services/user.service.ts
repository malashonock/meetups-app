import { httpClient } from 'api';
import { FullUser, ShortUser } from 'model';

export const getUsers = async (): Promise<FullUser[]> => {
  const { data: users } = await httpClient.get<FullUser[]>('/users');
  return users;
};

export const getUser = async (id: string): Promise<FullUser> => {
  const { data: user } = await httpClient.get<FullUser>(`/users/${id}`);
  return user;
};

export const getVotedUsers = async (meetupId: string): Promise<ShortUser[]> => {
  const { data: votedUsers } = await httpClient.get<ShortUser[]>(
    `/meetups/${meetupId}/votedusers`,
  );
  return votedUsers;
};

export const getParticipants = async (
  meetupId: string,
): Promise<ShortUser[]> => {
  const { data: participants } = await httpClient.get<ShortUser[]>(
    `/meetups/${meetupId}/participants`,
  );
  return participants;
};
