import { httpClient } from 'helpers';
import { Credentials, User } from 'model';

export const login = async (credentials: Credentials): Promise<void> => {
  await httpClient.post('/login', {
    data: credentials,
  });
};

export const checkLogin = async (): Promise<User> => {
  const { data: authenticatedUser } = await httpClient.get<User>('/login');
  return authenticatedUser;
};

export const logout = async (): Promise<void> => {
  await httpClient.get('/logout');
};
