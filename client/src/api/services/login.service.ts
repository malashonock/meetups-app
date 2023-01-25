import { httpClient } from 'api';
import { Credentials, FullUser, IUser } from 'model';

interface AuthResponse<T> {
  user: T;
}

export const login = async (credentials: Credentials): Promise<FullUser> => {
  const {
    data: { user: authenticatedUser },
  } = await httpClient.post<AuthResponse<FullUser>>('/login', {
    ...credentials,
  });

  return authenticatedUser;
};

export const checkLogin = async (): Promise<IUser> => {
  const {
    data: { user: authenticatedUser },
  } = await httpClient.get<AuthResponse<IUser>>('/login');
  return authenticatedUser;
};

export const logout = async (): Promise<void> => {
  await httpClient.get('/logout');
};
