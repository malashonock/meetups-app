import { httpClient } from 'api';
import { Credentials, IFullUser } from 'model';

export const login = async (credentials: Credentials): Promise<IFullUser> => {
  const { data: authenticatedUser } = await httpClient.post<IFullUser>(
    '/login',
    {
      ...credentials,
    },
  );

  return authenticatedUser;
};

export const checkLogin = async (): Promise<IFullUser> => {
  const { data: authenticatedUser } = await httpClient.get<IFullUser>('/login');
  return authenticatedUser;
};

export const logout = async (): Promise<void> => {
  await httpClient.get('/logout');
};
