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
