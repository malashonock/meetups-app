import { httpClient } from 'api';
import { ShortUser, User } from 'model';

export const getUsers = async (): Promise<User[]> => {
  const { data: users } = await httpClient.get<User[]>('/users');
  return users;
};

export const getUser = async (id: string): Promise<User> => {
  const { data: user } = await httpClient.get<User>(`/users/${id}`);
  return user;
};

export const getVotedUsers = async (id: string): Promise<ShortUser[]> => {
  const { data: votedUsers } = await httpClient.get<ShortUser[]>(
    `/meetups/${id}/votedusers`,
  );
  return votedUsers;
};
