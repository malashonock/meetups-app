import { httpClient } from 'api';
import { Credentials, FullUser, User } from 'model';

export const login = async (credentials: Credentials): Promise<FullUser> => {
  const { data: authenticatedUser } = await httpClient.post('/login', {
    ...credentials,
  });

  return authenticatedUser;
};

export const checkLogin = async (): Promise<User> => {
  const { data: authenticatedUser } = await httpClient.get<User>('/login');
  return authenticatedUser;
};

export const logout = async (): Promise<void> => {
  await httpClient.get('/logout');
};
