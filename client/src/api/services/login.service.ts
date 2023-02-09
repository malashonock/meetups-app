import { httpClient } from 'api';
import { Credentials, FullUser, User } from 'model';

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

export const checkLogin = async (): Promise<User> => {
  const {
    data: { user: authenticatedUser },
  } = await httpClient.get<AuthResponse<User>>('/login');
  return authenticatedUser;
};

export const logout = async (): Promise<void> => {
  await httpClient.get('/logout');
};
