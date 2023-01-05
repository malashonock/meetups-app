import { httpClient } from 'helpers';
import { Credentials, User } from 'model';

export const login = async (credentials: Credentials): Promise<void> => {
  await httpClient.post('/login', {
    data: credentials,
  });
};

export const checkLogin = async (): Promise<User> => {
  const authenticatedUser: User = await httpClient.get('/login');
  return authenticatedUser;
};
